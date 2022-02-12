console.log("rodando metrics...")

import { getAllProjects } from './strateegia-api.js';

async function calculateMetrics() {

  const project = await getAllProjects(localStorage.getItem("strateegiaAccessToken"));
  console.log("getAllProjects()");
  console.log(project);

  const result = JSONPath.JSONPath({ path: '$..lab', json: project });
  console.log(result);

}

calculateMetrics();
