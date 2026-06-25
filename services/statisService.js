import Grade from '../models/modelGrade.js';
import Absence from '../models/modelAbsences.js';
import Student from '../models/modelStudent.js';
import logger from '../utils/logger.js';

export {
  getGeneralAverage,
  getBestStudent,
  getRankings,
  countAbsencesByStudent,
  countAllAbsences
};

/**
 * Fonction privée : calcule la moyenne brute d'un étudiant
 */
function calcAverage(student_id) {
  const grades = Grade.getByStudent(student_id);
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, g) => acc + g.note, 0);
  return sum / grades.length;
}

/**
 * Calcule la moyenne générale de tout l'établissement
 */
function getGeneralAverage() {
  const grades = Grade.getAll();
  if (grades.length === 0) {
    logger.info('Moyennes générales consultées (aucune note disponible)');
    return "0.00";
  }
  const sum = grades.reduce((acc, g) => acc + g.note, 0);
  const average = (sum / grades.length).toFixed(2);
  logger.info(`Moyenne générale consultée : ${average}`);
  return average;
}

/**
 * Génère le classement de tous les étudiants (du meilleur au moins bon)
 */
function getRankings() {
  const students = Student.getAll();
  const rankings = students
    .map((student) => ({
      ...student,
      moyenne: calcAverage(student.id).toFixed(2)
    }))
    .sort((a, b) => parseFloat(b.moyenne) - parseFloat(a.moyenne));

  logger.info(`Classement consulté (${rankings.length} étudiants)`);
  return rankings;
}

/**
 * Récupère le meilleur étudiant de l'établissement
 */
function getBestStudent() {
  const rankings = getRankings();
  if (rankings.length === 0) {
    logger.info('Meilleur étudiant consulté (aucun étudiant en base)');
    return null;
  }

  // Le premier du classement trié par ordre décroissant
  const best = rankings[0];
  
  logger.info(`Meilleur étudiant : ${best.prenom} ${best.nom} (Moyenne: ${best.moyenne})`);
  return best;
}

/**
 * Compte et ventile les absences d'un étudiant spécifique
 */
function countAbsencesByStudent(student_id) {
  const absences = Absence.getByStudent(student_id);
  const result = {
    total: absences.length,
    justifiees: absences.filter(a => a.status === 'justifiée').length,
    non_justifiees: absences.filter(a => a.status === 'non justifiée').length
  };
  logger.info(`Absences de l'étudiant ID=${student_id} : Total=${result.total}, Justifiées=${result.justifiees}, Non justifiées=${result.non_justifiees}`);
  return result;
}

/**
 * Compte et ventile toutes les absences de l'établissement
 */
function countAllAbsences() {
  const absences = Absence.getAll();
  const result = {
    total: absences.length,
    justifiees: absences.filter(a => a.status === 'justifiée').length,
    non_justifiees: absences.filter(a => a.status === 'non justifiée').length
  };
  logger.info(`Toutes les absences globales : Total=${result.total}, Justifiées=${result.justifiees}, Non justifiées=${result.non_justifiees}`);
  return result;
}