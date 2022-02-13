import { getAllProjects, getProjectById, getAllDivergencePointsByMapId } from "./strateegia-api.js";
import { executeCalculations } from "./metrics.js";

let users = [];
const accessToken = localStorage.getItem("strateegiaAccessToken");

export async function initializeProjectList() {
    const labs = await getAllProjects(accessToken)
    console.log("getAllProjects()");
    console.log(labs);
    let listProjects = [];
    for (let i = 0; i < labs.length; i++) {
        let currentLab = labs[i];
        if (currentLab.lab.name == null) {
            currentLab.lab.name = "Personal";
        }
        for (let j = 0; j < currentLab.projects.length; j++) {
            const project = currentLab.projects[j];
            const newProject = {
                "id": project.id,
                "title": project.title,
                "lab_id": currentLab.lab.id,
                "lab_title": currentLab.lab.name
            };
            listProjects.push(newProject);
        }
    }
    // Using d3 to create the list of projects
    let options = d3.select("#projects-list")
        .on("change", () => {
            // Print the selected project id
            let selectedProject = d3.select("#projects-list").property('value');
            localStorage.setItem("selectedProject", selectedProject);
            updateMapList(selectedProject);
            console.log(selectedProject);
        })
        .selectAll("option")
        .data(listProjects, d => d.id);
    options.enter()
        .append("option")
        .attr("value", (d) => { return d.id })
        .text((d) => { return `${d.lab_title} -> ${d.title}` });
    options.append("option")
        .attr("value", (d) => { return d.id })
        .text((d) => { return `${d.lab_title} -> ${d.title}` });
    options.exit().remove();
    localStorage.setItem("selectedProject", listProjects[0].id);
    updateMapList(listProjects[0].id);
}

async function updateMapList(selectedProject) {
    users = [];
    let project = await getProjectById(accessToken, selectedProject);
    console.log("getProjectById()");
    console.log(project);
    project.users.forEach(user => {
        users.push({ id: user.id, name: user.name });
    });
    // localStorage.removeItem("users");
    localStorage.setItem("users", JSON.stringify(users));
    let options = d3.select("#maps-list")
        .on("change", () => {
            // Print the selected map id
            let selectedMap = d3.select("#maps-list").property('value');
            localStorage.setItem("selectedMap", selectedMap);
            console.log(selectedMap);
            executeCalculations();
        })
        .selectAll("option")
        .data(project.maps, d => d.id);
    options.enter()
        .append("option")
        .attr("value", (d) => { return d.id })
        .text((d) => { return d.title });
    options.append("option")
        .attr("value", (d) => { return d.id })
        .text((d) => { return d.title });
    options.exit().remove();
    const mapId = project.maps[0].id;
    localStorage.setItem("selectedMap", mapId);
    updateToolList(mapId);
    // const map = await getAllDivergencePointsByMapId(accessToken, project.maps[0].id);
    // console.log(map.content);
}

async function updateToolList(selectedMap) {
    getAllDivergencePointsByMapId(accessToken, selectedMap).then(map => {
        console.log("getAllDivergencePointsByMapId()");
        console.log(map);
        /* 
           Remember that the kit Id is the generic kit! 
           The content Id is the instance of that kit in the map
           In this function, we are only interested in the instance of the kit
         */

        let options = d3.select("#tools-list")
            .on("change", () => {
                // Print the selected kit id
                let selectedTool = d3.select("#tools-list").property("value");
                setSelectedTool(selectedTool);
            })
            .selectAll("option")
            .data(map.content, d => d.id);
        options.enter()
            .append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return d.tool.title });
        options.append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return d.tool.title });
        options.exit().remove();
        let initialSelectedTool = map.content[0].id;
        setSelectedTool(initialSelectedTool);
    });
}

function setSelectedTool(toolId) {
    localStorage.setItem("selectedTool", toolId);
    const selectedProject = localStorage.getItem("selectedProject");
    const selectedMap = localStorage.getItem("selectedMap");
    const params = executeCalculations(selectedProject, '601accdc999f4a51b47056b1', toolId);
    d3.select("#params").text(JSON.stringify(params, undefined, "\t"));
    //buildDivergencePointStructure(localStorage.getItem("selectedTool"));
}