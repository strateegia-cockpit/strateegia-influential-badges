import { getAllProjects, getProjectById, getAllDivergencePointsByMapId } from "./strateegia-api.js";
import { executeCalculations } from "./metrics.js";
import { tabulate } from "./d3functions.js";

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
            updateDivPointList(selectedMap);
            // executeCalculations();
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

    updateDivPointList(mapId);
    // const map = await getAllDivergencePointsByMapId(accessToken, project.maps[0].id);
    // console.log(map.content);
}

async function updateDivPointList(selectedMap) {
    getAllDivergencePointsByMapId(accessToken, selectedMap).then(map => {
        console.log("getAllDivergencePointsByMapId()");
        console.log(map);
        let options = d3.select("#divpoints-list");
        options.selectAll("option").remove();
        if (map.content.length > 0) {
            map.content.forEach(function (divPoint) {
                options.append("option").attr("value", divPoint.id).text(divPoint.tool.title);
            });
            options.on("change", () => {
                let selectedDivPoint = d3.select("#divpoints-list").property("value");
                setSelectedDivPoint(selectedDivPoint);
            });

            let initialSelectedDivPoint = map.content[0].id;
            setSelectedDivPoint(initialSelectedDivPoint);

        } else {
            console.log("Não há pontos de divergência associados ao mapa selecionado");
        }
    });
}

async function setSelectedDivPoint(divPointId) {
    localStorage.setItem("selectedDivPoint", divPointId);
    const authorsScoresSorted = await executeCalculations(divPointId);
    if (authorsScoresSorted.length > 0) {
        let columns = Object.keys(authorsScoresSorted[0]);
        columns.splice(columns.indexOf('id'), 1);
        tabulate(authorsScoresSorted, columns);
    } else {
        let table = d3.select('#table-body');
        let thead = table.select('thead')
        let tbody = table.select('tbody');
        tbody.selectAll('tr').remove();
        thead.selectAll('th').remove();
        thead.append('th').text('Ainda não há respostas para o kit selecionado');
    }
}