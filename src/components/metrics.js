import { getAllProjects, getCommentEngagementByContent, getCommentsGroupedByQuestionReport, getUser } from "strateegia-api";
// import { tabulate } from './d3functions.js';
import { JSONPath } from 'jsonpath-plus';

// const users = JSON.parse(localStorage.getItem("users") || '');
const accessToken = localStorage.getItem("accessToken");

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
};

export async function testJsonPathWithStrateegiaAPI() {

  const project = await getAllProjects(accessToken);

  const user = await getUser(accessToken);

  const result = JSONPath({ path: `$..comments[?(@.author.id == '${user.id}')]`, json: project });

}

export async function gatherData(projectId, userId, divergencePointId) {
  const accessToken = localStorage.getItem("accessToken");
  const divPointReport = await getCommentsGroupedByQuestionReport(accessToken, divergencePointId);
  const commentEngagementByContent = await getCommentEngagementByContent(accessToken, projectId);
  const statisticsForDivergentPoint = commentEngagementByContent.filter(divPoints => divPoints.id == divergencePointId)[0];
  // =======================================
  params.qtd_questoes_respondidas = JSONPath({ path: `$..comments[?(@.author.id == '${userId}')]`, json: divPointReport }).length;
  params.qtd_questoes_totais = statisticsForDivergentPoint.question_count;
  params.qtd_comentarios_usuario = JSONPath({ path: `$..comments..replies[?(@.author.id == '${userId}')]`, json: divPointReport }).length;
  params.qtd_comentarios_totais = statisticsForDivergentPoint.total_comments_count;
  params.qtd_participantes = statisticsForDivergentPoint.people_active_count;
  params.total_agreements_user = JSONPath({ path: `$..comments..agreements..[?(@.user_id == '${userId}')]`, json: divPointReport }).length;;
  params.total_agreements = statisticsForDivergentPoint.agreements_comments_count;
  params.bigger_amount_agreements_user = "COMPLETAR";
  params.average_agreements_per_comment = "COMPLETAR";
  params.total_inner_replies = "COMPLETAR";
  params.total_replies = statisticsForDivergentPoint.reply_comments_count;
  params.bigger_amount_inner_replies = "COMPLETAR";
  params.average_inner_replies_per_comment = "COMPLETAR";

}

async function getDivPointReport(divergencePointId) {
  const accessToken = localStorage.getItem("accessToken");
  const divPointReport = await getCommentsGroupedByQuestionReport(accessToken, divergencePointId);
  return divPointReport;
}

async function getAuthorsData(divPointReport) {
  let authorsData = [];
  // const divPointReport = await getCommentsGroupedByQuestionReport(accessToken, divergencePointId);
  divPointReport?.forEach(question => {
    let authorsIdsAnsweredThisQuestion = [];
    question.comments.forEach(comment => {
      const authorId = comment.author.id;
      if (authorsData.filter(author => author.id === authorId).length > 0) {
        const authorIndex = authorsData.findIndex(author => author.id === authorId);
        if (!authorsIdsAnsweredThisQuestion.includes(authorId)) {
          authorsData[authorIndex].amount_ans_questions += 1;
          authorsIdsAnsweredThisQuestion.push(authorId);
        }
        authorsData[authorIndex].amount_comments += 1;
        authorsData[authorIndex].total_agreements += comment.agreements.length;
        authorsData[authorIndex].bigger_amount_agreements = Math.max(comment.agreements.length, authorsData[authorIndex].bigger_amount_agreements);
        authorsData[authorIndex].total_inner_replies += comment.reply_count;
        authorsData[authorIndex].bigger_amount_inner_replies = Math.max(comment.reply_count, authorsData[authorIndex].bigger_amount_inner_replies);
      } else {
        authorsData.push({
          id: authorId,
          name: comment.author.name,
          amount_comments: 1,
          amount_ans_questions: 1,
          total_agreements: comment.agreements.length,
          bigger_amount_agreements: comment.agreements.length,
          total_inner_replies: comment.reply_count,
          bigger_amount_inner_replies: comment.reply_count,
        });
        authorsIdsAnsweredThisQuestion.push(authorId);
      }
    });
  });
  return authorsData;
}

async function getKitData(divPointReport, authorsData) {
  // const divPointReport = await getCommentsGroupedByQuestionReport(accessToken, divergencePointId);
  let kitData = {};
  kitData.amount_questions = divPointReport.length;
  kitData.total_comments = 0;
  kitData.total_agreements = 0;
  kitData.total_replies = 0;
  divPointReport.forEach(question => {
    let commentList = question.comments;
    kitData.total_comments += commentList.length;
    commentList.forEach(comment => {
      kitData.total_agreements += comment.agreements.length;
      kitData.total_replies += comment.reply_count;
    });
  });
  kitData.total_users = authorsData.length;
  kitData.average_agreements_per_comment = kitData.total_agreements / kitData.total_comments;
  let total_inner_replies_per_user = 0;
  authorsData.forEach(author => {
    total_inner_replies_per_user += author.total_inner_replies;
  });
  kitData.average_inner_replies_per_user = total_inner_replies_per_user / kitData.total_users;
  return kitData;
}

// https://github.com/ricarthlima/ms-strateegia-user-analysis/blob/10f7d91a744748e8f078f14f4320767415e9cd7a/ms_influential_users_rails/app/controllers/influential_users_controller.rb#L7
function calculateAuthorScore(author, kitData) {

  let authorScore = {
    id: author.id,
    name: author.name,
    f1: 0,
    f2: 0,
    f3: 0,
    f4: 0,
    f5: 0,
    f6: 0,
    metrica1: 0,
    metrica2: 0,
    score: 0
  };

  const qtd_questoes_respondidas = author.amount_ans_questions;
  const qtd_questoes_totais = kitData.amount_questions;

  const qtd_comentarios_usuario = author.amount_comments;
  const qtd_comentarios_totais = kitData.total_comments;
  const qtd_participantes = kitData.total_users;

  const total_agreements_user = author.total_agreements;
  const total_agreements = kitData.total_agreements;

  const bigger_amount_agreements_user = author.bigger_amount_agreements;
  const average_agreements_per_comment = kitData.average_agreements_per_comment;

  const total_inner_replies = author.total_inner_replies;
  const total_replies = kitData.total_replies;

  const bigger_amount_inner_replies = author.bigger_amount_inner_replies;
  const average_inner_replies_per_comment = kitData.average_inner_replies_per_user;

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
  let f1 = 0;
  if (qtd_questoes_totais > 0) {
    f1 = qtd_questoes_respondidas / qtd_questoes_totais;
  }

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
  let f3 = 0;
  if (total_agreements > 0) {
    f3 = total_agreements_user / total_agreements;
  }
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
  const relativeCalculation = (_bigger_amount_x_user, _average_x_per_comment) => {
    const preF4 = _bigger_amount_x_user / _average_x_per_comment;
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

  let f5 = 0;

  if (total_replies != 0) {
    f5 = total_inner_replies / total_replies;
  }

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
  const formulaFinal = ((metrica1) + (metrica2)) / 3; Math.round((formulaFinal.toFixed(2) * 100) / 0.96)

  authorScore.f1 = f1.toFixed(2);
  authorScore.f2 = f2.toFixed(2);
  authorScore.f3 = f3.toFixed(2);
  authorScore.f4 = f4.toFixed(2);
  authorScore.f5 = f5.toFixed(2);
  authorScore.f6 = f6.toFixed(2);
  authorScore.metrica1 = Math.round((metrica1 * 100) / 1.25);
  authorScore.metrica2 = Math.round((metrica2 * 100));
  authorScore.score = Math.round((formulaFinal * 100) / 0.96);

  return authorScore;
}


async function executeCalculations(divergencePointId) {

  const divPointReport = await getDivPointReport(divergencePointId);
  const authorsData = await getAuthorsData(divPointReport);
  const kitData = await getKitData(divPointReport, authorsData);

  const authorsScores = [];
  authorsData.forEach(author => {
    authorsScores.push(calculateAuthorScore(author, kitData));
  });
  const authorsScoresSorted = authorsScores.sort((a, b) => b.score - a.score);
  return authorsScoresSorted;
}

async function getMeanForAllDivPoints(divId) {

  const idsArray = divId.split(',');
  
  const allScores = await Promise.all(
    idsArray.map((id) => {
      return executeCalculations(id);
    })
  ).then(data => data.flat())

  const occurrences = allScores.reduce((acc, { name }) => {
    return { ...acc, [name]: (acc[name] || 0) + 1 }
  }, []);

  const result = getResult(allScores, occurrences, divId);

  return result;
}

function getResult(allScores, occurrences, divId) {

  const result = Object.keys(occurrences).map(occurrence => {
    const singleUser = allScores.filter(({ name }) => name === occurrence)
      .reduce(calculateUserScore, [])
      .map(user => calculateUserScoreMean(user, divId));
    return singleUser
  })
  return result.flat();
}

function calculateUserScore(acc, { name, f1, f2, f3, f4, f5, f6, id, metrica1, metrica2, score }) {

  const calculate = (value, key) => {
    return Number(value) + (acc[0]?.[key] || 0)
  }

  return [{
    'name': name,
    'id': id,
    'f1': calculate(f1, 'f1'),
    'f2': calculate(f2, 'f2'),
    'f3': calculate(f3, 'f3'),
    'f4': calculate(f4, 'f4'),
    'f5': calculate(f5, 'f5'),
    'f6': calculate(f6, 'f6'),
    'metrica1': calculate(metrica1, 'metrica1'),
    'metrica2': calculate(metrica2, 'metrica2'),
    'score': calculate(score, 'score')
  }]
}

function calculateUserScoreMean(user, divId) {

  const allDivPoints = divId.length;
  const getMean = (key) => (user[key] / allDivPoints).toFixed(2)
  const meanUser = {
    'name': user.name,
    'f1': getMean('f1'),
    'f2': getMean('f2'),
    'f3': getMean('f3'),
    'f4': getMean('f4'),
    'f5': getMean('f5'),
    'f6': getMean('f6'),
    'metrica1': getMean('metrica1'),
    'metrica2': getMean('metrica2'),
    'score': getMean('score')
  }
  return meanUser
}


export { executeCalculations, getMeanForAllDivPoints }