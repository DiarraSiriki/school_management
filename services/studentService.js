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
}

function addStudent(matricule, nom, prenom, age, classe, email, password) {
  // 1. SÉCURITÉ : On vérifie si le matricule existe déjà en base de données
  const existingStudent = findStudentByMatricule(matricule);
  if (existingStudent) {
    logger.warn(`Échec de l'ajout : Le matricule ${matricule} est déjà utilisé.`);
    throw new Error(`Le matricule '${matricule}' appartient déjà à un étudiant.`);
  }

  // 2. Si le matricule est libre, on crée l'étudiant dans sa table
  const result = Student.create(matricule, nom, prenom, age, classe);
  const studentId = result.lastInsertRowid; 

  // 3. On crée l'utilisateur associé en lui transmettant le studentId
  addUser(`${prenom}_${nom}`, 'etudiant', email, password, studentId, null);
  
  logger.info(`Étudiant ajouté avec succès : ID=${studentId}, Matricule=${matricule}`);
  return studentId;
}

function updateStudent(id, matricule, nom, prenom, age, classe) {
  const result = Student.update(id, matricule, nom, prenom, age, classe);
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
  const results = Student.search(keyword);
  return results;
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