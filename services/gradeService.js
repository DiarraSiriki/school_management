import Grade from '../models/modelGrade.js';

export function addGrade(student_id, subject_id, note) {
    const result = Grade.create(student_id, subject_id, note);
    return result.lastInsertRowid;
}

export function updateGrade(id, note) {
    const result = Grade.update(id, note);
    return result.changes > 0;
}

export function removeGrade(id) {
    const result = Grade.delete(id);
    return result.changes > 0;
}

export function listGrades() {
    return Grade.getAll();
}

export function getGradeById(id) {
    return Grade.getById(id);
}

export function getStudentGrades(student_id) {
    return Grade.getByStudent(student_id);
}
