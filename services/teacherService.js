import Teacher from '../models/teacher_models.js';
import logger from '../logs/loger.js';

export function addTeacher(nom, matiere) {
  const result = Teacher.create(nom, matiere);
  logger.info(`Professeur ajouté: ID=${result.lastInsertRowid}, Nom=${nom}, Matière=${matiere}`);
  return result.lastInsertRowid;
}

export function updateTeacher(id, nom, matiere) {
  const result = Teacher.update(id, nom, matiere);
  if (result.changes > 0) {
    logger.info(`Professeur modifié: ID=${id}, Nom=${nom}, Matière=${matiere}`);
  }
  return result.changes > 0;
}

export function removeTeacher(id) {
  const result = Teacher.delete(id);
  if (result.changes > 0) {
    logger.info(`Professeur supprimé: ID=${id}`);
  }
  return result.changes > 0;
}

export function searchTeacher(keyword) {
  const results = Teacher.search(keyword);
  logger.info(`Recherche de professeur: Mot-clé='${keyword}' (${results.length} résultats)`);
  return results;
}

export function listTeachers() {
  const teachers = Teacher.getAll();
  logger.info(`Liste des professeurs consultée (${teachers.length} professeurs)`);
  return teachers;
}