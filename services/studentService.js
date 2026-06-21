import Student from '../models/modelStudent.js';
import logger from '../utils/logger.js';
export{ addStudent, updateStudent, removeStudent, searchStudent, listStudents, findStudentByMatricule }

function addStudent(matricule, nom, prenom, age, classe) {

  const result = Student.create(matricule, nom, prenom, age, classe);
  logger.info(`Étudiant ajouté: ID=${result.lastInsertRowid}, Matricule=${matricule}, Nom=${prenom} ${nom}`);
  return result.lastInsertRowid;
}

function updateStudent(id, matricule, nom, prenom, age, classe) {

  const result = Student.update(id, matricule, nom, prenom, age, classe);
  if (result.changes > 0) {
    logger.info(`Étudiant modifié: ID=${id}, Matricule=${matricule}, Nom=${prenom} ${nom}`);
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
  logger.info(`Recherche d'étudiant: Mot-clé='${keyword}' (${results.length} résultats)`);
  return results;
}

function listStudents() {
  
  const students = Student.getAll();
  logger.info(`Liste des étudiants consultée (${students.length} étudiants)`);
  return students;
}

function findStudentByMatricule(matricule) {

  const student = Student.getByMatricule(matricule);
  if (student) {
    logger.info(`Étudiant trouvé par matricule: ${matricule}`);
  }
  return student;
}
