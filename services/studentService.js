import Student from '../models/modelStudent.js';
import logger from '../utils/logger.js';
import { addUser } from './userService.js'; 

export { 
  addStudent, 
  updateStudent, 
  removeStudent, 
  searchStudent, 
  listStudents, 
  findStudentByMatricule,
  getStudentById 
};

function addStudent(matricule, nom, prenom, age, classe, email, password) {
  const existingStudent = findStudentByMatricule(matricule);
  if (existingStudent) {
    logger.warn(`Échec de l'ajout : Le matricule ${matricule} est déjà utilisé.`);
    throw new Error(`Le matricule '${matricule}' appartient déjà à un étudiant.`);
  }

  const userId = addUser(`${prenom}_${nom}`, 'student', email, password);

  const result = Student.create(matricule, nom, prenom, age, classe, userId);
  const studentId = result.lastInsertRowid; 
  
  logger.info(`Étudiant ajouté avec succès : ID=${studentId}, Matricule=${matricule}, UserID=${userId}`);
  return studentId;
}

function updateStudent(id, matricule, nom, prenom, age, classe, user_id = null) {
  const result = Student.update(id, matricule, nom, prenom, age, classe, user_id);
  if (result.changes > 0) {
    logger.info(`Étudiant modifié: ID=${id}`);
  }
  return result.changes > 0;
}

function removeStudent(id) {
  const result = Student.delete(id);
  if (result.changes > 0) {
    logger.info(`Étudiant supprimé: ID=${id}`);
  }
  return result.changes > 0;
}

function searchStudent(keyword) {
  return Student.search(keyword);
}

function listStudents() {
  return Student.getAll();
}

function findStudentByMatricule(matricule) {
  return Student.getByMatricule(matricule);
}

function getStudentById(id) {
  return Student.getById(id);
}