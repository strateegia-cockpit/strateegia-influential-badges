console.log("rodando metrics...")

import { getAllProjects, getCommentsGroupedByQuestionReport } from './strateegia-api.js';

const users = JSON.parse(localStorage.getItem("users"));
const accessToken = localStorage.getItem("strateegiaAccessToken");
let params = {
  "qtd_questoes_respondidas": 0,
  "qtd_questoes_totais": 0,

  "qtd_comentarios_usuario": 0,
  "qtd_comentarios_totais": 0,
  "qtd_participantes": 0,

  "total_agreements_user": 0,
  "total_agreements": 0,

  "bigger_amount_agreements_user": 0,
  "average_agreements_per_comment": 0,

  "total_inner_replies": 0,
  "total_replies": 0,

  "bigger_amount_inner_replies": 0,
  "average_inner_replies_per_comment": 0,
}

async function testJsonPathWithStrateegiaAPI() {

  const project = await getAllProjects(localStorage.getItem("strateegiaAccessToken"));
  console.log("getAllProjects()");
  console.log(project);

  const result = JSONPath.JSONPath({ path: '$..lab', json: project });
  console.log(result);

}

async function gatherData(userId, divergencePointId) {
  const divPointReport = await getCommentsGroupedByQuestionReport(accessToken, divergencePointId);
  params.qtd_questoes_totais = divPointReport.length;
  console.log(params);
}

// https://github.com/ricarthlima/ms-strateegia-user-analysis/blob/10f7d91a744748e8f078f14f4320767415e9cd7a/ms_influential_users_rails/app/controllers/influential_users_controller.rb#L7
async function calculateMetrics() {


  const qtd_questoes_respondidas = params.qtd_questoes_respondidas;
  const qtd_questoes_totais = params.qtd_questoes_totais;

  const qtd_comentarios_usuario = params.qtd_comentarios_usuario;
  const qtd_comentarios_totais = params.qtd_comentarios_totais;
  const qtd_participantes = params.qtd_participantes;

  const total_agreements_user = params.total_agreements_user;
  const total_agreements = params.total_agreements;

  const bigger_amount_agreements_user = params.bigger_amount_agreements_user;
  const average_agreements_per_comment = params.average_agreements_per_comment;

  const total_inner_replies = params.total_inner_replies;
  const total_replies = params.total_replies;

  const bigger_amount_inner_replies = params.bigger_amount_inner_replies;
  const average_inner_replies_per_comment = params.average_inner_replies_per_comment;

  /*
  O cálculo da métrica de influência é baseado no trabalho: 
  https://github.com/ricarthlima/ms-strateegia-user-analysis

  Um usuário influente é aquele que (i) responde as questões e (ii) essa sua resposta motiva diálogo, ou seja, gera comentários (divergências e convergências explícitas) e concordâncias" 
  */

  /*
  ======================================
  Métrica 1
  Descrição da Métrica: Para saber se um usuário responde às questões existem duas boas formas de mensurar: em termos absolutos, ou seja, o quantas questões ele respondeu dado o total. E em termos relativos, quanto proporcionalmente mais que a média esperada de cada usuários ele respondeu.
  Juntaremos esses dois cálculos para valorar a questão "(i) responde as questões";
  */

  /* 
  (f1) Termos Absolutos
  Valor máximo: 1
  Valor esperado para usuário influente: Entre 0,75 e 1
  Observação: Não importa quantos comentários ele fez nessa resposta
 */
  const f1 = qtd_questoes_respondidas / qtd_questoes_totais;

  /*
  (f2) Termos Relativos
  Valor máximo: 3;
  Valor esperado para usuário influente: Entre 1 e 3;
  Observações: O limitador de 3 é para evitar distorções no cálculo final. Isso implica que caso um usuário
  tenha comentado mais que 3 vezes mais que a média esperada, isso ainda será valorado como 3
  */
  const f2 = Math.min(3, (qtd_comentarios_usuario / qtd_comentarios_totais) * qtd_participantes);

  /*
  Métrica 1
  Valor máximo: 1.25
  Valor esperado para usuário influente: 1
  Valor esperado para usuário médio: 0.25
  */
  const metrica1 = (f1 * 2 + f2) / 4;

  /*
  ==========================================================
  Métrica 2
  Descrição da Métrica: Para valorar quanto a resposta gerou engajamento usaremos duas funções para os agreements e duas para os replies. A fórmula parcial deve responder o "(ii) essa sua resposta motiva diálogo".
  */

  /* 
  (f3) Agreements Absolutos
  Valor máximo: 1
  Valor esperado para usuário influente: Entre 0,1 e 0,5
  */
  const f3 = total_agreements_user / total_agreements;

  /*
  (f4) Agreements Relativos
    > 5 -> 1,25
    > 3 -> 1
    > 1 -> 0,75
    else -> 0
  Valor máximo: 1,25
  Valor esperado para usuário influente: Entre 0,76 e 1,25
  Observação: O objetivo dessa função é valorizar caso o usuário tenha criado uma resposta que destoa completamente do número das outras, com uma quantidade massiva de agreements (limitadas a até 5 vezes a média de agreements por comentário).
   */
  const relativeCalculation = (_bigger_amout_x_user, _average_x_per_comment) => {
    const preF4 = _bigger_amout_x_user / _average_x_per_comment;
    let result = 0
    if (preF4 > 5) {
      result = 1.25;
    } else if (preF4 > 3) {
      result = 1;
    } else if (preF4 > 1) {
      result = 0.75;
    } else {
      result = 0;
    }
    return result;
  };
  const f4 = relativeCalculation(bigger_amount_agreements_user, average_agreements_per_comment);

  /*
  (f5) Replies Absolutos

  Valor máximo: 1
  Valor esperado para usuário influente: Entre 0,1 e 0,5
  Observação: "total_inner_replies" é o somatório recursivo de todos os comentários gerados por aquela resposta.
  */
  const f5 = total_inner_replies / total_replies;

  /*
  (f6) Replies Relativos
  > 5 -> 1,25
  > 3 -> 1
  > 1 -> 0,75
  else -> 0
  Valor máximo: 1,25
  Valor esperado para usuário influente: Entre 0,75 e 1,25
  Observação: O mesmo objetivo dos agreements aplicado para os replies;
  */
  const f6 = relativeCalculation(bigger_amount_inner_replies, average_inner_replies_per_comment);

  const metrica2 = (f3 * 2 + f4) / 4 + (f5 * 2 + f6) / 4;

  /*
  Fórmula Final

  (((f1 * 2 + f2)/4) + ((f3*2 + f4)/4 + (f5*2 + f6)/4))/3

  A média ponderada (peso da métrica 2 está implícito pelo fato de haver uma soma de duas sub-métricas que equivalem sozinhas a métrica 1) é em função de acreditarmos que o engajamento gerado pelas respostas do usuário é ainda mais importante do que a quantidade de comentários feitas pelo mesmo.
  */
  const formulaFinal = ((metrica1) + (metrica2)) / 3;

  return formulaFinal;
}


export function executeCalculations(userId, divPointId){
  // Execute functions
  // testJsonPathWithStrateegiaAPI();
  gatherData(userId, divPointId);
  calculateMetrics();
}
