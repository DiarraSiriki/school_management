import Teacher from '../models/teacher_models.js';
import logger from '../utils/logger.js';
import { addUser } from './userService.js'; 

export {
  addTeacher,
  updateTeacher,
  removeTeacher,
  searchTeacher,
  listTeachers,
  getTeacherById
};

function addTeacher(nom, matiere, email, password) {
  // 1. On crée d'abord le compte utilisateur pour obtenir le user_id
  const userId = addUser(nom, 'teacher', email, password);

  // 2. On enregistre dans la table teachers avec le user_id associé
  const result = Teacher.create(nom, matiere, userId);
  const teacherId = result.lastInsertRowid;

  logger.info(`Professeur ajouté: ID=${teacherId}, Nom=${nom}, UserID=${userId}`);
  return teacherId;
}

function updateTeacher(id, nom, matiere, user_id = null) {
  const result = Teacher.update(id, nom, matiere, user_id);
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