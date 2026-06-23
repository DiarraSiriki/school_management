import Teacher from '../models/teacher_models.js';
import logger from '../utils/logger.js';
import { addUser } from './userService.js'; // Correction : Import de addUser au lieu de createUser

export {
    addTeacher,
    updateTeacher,
    removeTeacher,
    searchTeacher,
    listTeachers,
    getTeacherById
}

function addTeacher(nom, matiere, email, password) {
  // 1. Enregistre dans la table teachers et récupère le résultat
  const result = Teacher.create(nom, matiere);
  const teacherId = result.lastInsertRowid; // Récupère l'ID généré automatiquement

  // 2. Enregistre dans la table users avec le teacher_id associé
  addUser(nom, 'professeur', email, password, null, teacherId);
  
  logger.info(`Professeur ajouté: ID=${teacherId}, Nom=${nom}`);
  return teacherId;
}

function updateTeacher(id, nom, matiere) {
  const result = Teacher.update(id, nom, matiere);
  if (result.changes > 0) {
    logger.info(`Professeur modifié: ID=${id}`);
  }
  return result.changes > 0;
}

function removeTeacher(id) {
  const result = Teacher.delete(id);
  if (result.changes > 0) {
    logger.info(`Professeur supprimé: ID=${id}`);
  }
  return result.changes > 0;
}

function searchTeacher(keyword) {
  return Teacher.search(keyword);
}

function listTeachers() {
  return Teacher.getAll();
}

function getTeacherById(id) {
  return Teacher.getById(id);
}