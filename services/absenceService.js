import Absence from '../models/modelAbsences.js';
import logger from '../logs/loger.js';

const STATUS = {
  JUSTIFIEE: 'justifiée',
  NON_JUSTIFIEE: 'non justifiée'
};

export function recordAbsence(student_id, date, status = STATUS.NON_JUSTIFIEE) {
  const normalizedStatus = status.toLowerCase().includes('just') ? STATUS.JUSTIFIEE : STATUS.NON_JUSTIFIEE;
  const result = Absence.create(student_id, date, normalizedStatus);
  logger.info(`Absence enregistrée: ID=${result.lastInsertRowid}, Étudiant ID=${student_id}, Date=${date}, Statut=${normalizedStatus}`);
  return result.lastInsertRowid;
}

export function updateAbsenceStatus(id, status) {
  const normalizedStatus = status.toLowerCase().includes('just') ? STATUS.JUSTIFIEE : STATUS.NON_JUSTIFIEE;
  const result = Absence.updateStatus(id, normalizedStatus);
  if (result.changes > 0) {
    logger.info(`Statut d'absence modifié: ID=${id}, Nouveau statut=${normalizedStatus}`);
  }
  return result.changes > 0;
}

export function markAsJustified(id) {
  return updateAbsenceStatus(id, STATUS.JUSTIFIEE);
}

export function markAsUnjustified(id) {
  return updateAbsenceStatus(id, STATUS.NON_JUSTIFIEE);
}

export function getHistory() {
  const absences = Absence.getAll();
  logger.info(`Historique des absences consulté (${absences.length} absences)`);
  return absences;
}

export function getStudentHistory(student_id) {
  const absences = Absence.getByStudent(student_id);
  logger.info(`Historique des absences consulté pour l'étudiant ID=${student_id} (${absences.length} absences)`);
  return absences;
}
