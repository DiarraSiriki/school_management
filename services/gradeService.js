import Grade from '../models/modelGrade.js';

export {
  addGrade,
  updateGrade,
  removeGrade,
  listGrades,
  getGradeById,
  getStudentGrades,
  calculateAverage // Ajout de l'export
};

function addGrade(student_id, subject_id, note) {
  const result = Grade.create(student_id, subject_id, note);
  return result.lastInsertRowid;
}

function updateGrade(id, note) {
  const result = Grade.update(id, note);
  return result.changes > 0;
}

function removeGrade(id) {
  const result = Grade.delete(id);
  return result.changes > 0;
}

function listGrades() {
  return Grade.getAll();
}

function getGradeById(id) {
  return Grade.getById(id);
}

function getStudentGrades(student_id) {
  return Grade.getByStudent(student_id);
}

/**
 * Récupère la moyenne d'un étudiant depuis le modèle
 * @param {number|string} student_id 
 * @returns {number|null} La moyenne ou null si aucune note
 */
function calculateAverage(student_id) {
  return Grade.getAverageByStudent(student_id);
}