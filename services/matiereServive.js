import Subjects from '../models/model_Subjects.js';
import logger from '../logs/loger.js';

export function addSubject(nom, teacher_id) {
  const result = Subjects.create(nom, teacher_id);
  logger.info(`Matière ajoutée: ID=${result.lastInsertRowid}, Nom=${nom}, Professeur ID=${teacher_id}`);
  return result.lastInsertRowid;
}

export function updateSubject(id, nom, teacher_id) {
  const result = Subjects.update(id, nom, teacher_id);
  if (result.changes > 0) {
    logger.info(`Matière modifiée: ID=${id}, Nom=${nom}, Professeur ID=${teacher_id}`);
  }
  return result.changes > 0;
}

export function removeSubject(id) {
  const result = Subjects.delete(id);
  if (result.changes > 0) {
    logger.info(`Matière supprimée: ID=${id}`);
  }
  return result.changes > 0;
}

export function searchSubject(keyword) {
  const results = Subjects.search(keyword);
  logger.info(`Recherche de matière: Mot-clé='${keyword}' (${results.length} résultats)`);
  return results;
}

export function getSubjectById(id) {
  const subject = Subjects.getById(id);
  if (subject) {
    logger.info(`Matière trouvée par ID: ${id}`);
  }
  return subject;
}

export function listSubjects() {
  const subjects = Subjects.getAll();
  logger.info(`Liste des matières consultée (${subjects.length} matières)`);
  return subjects;
}
