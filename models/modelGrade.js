import database from '../db/database.js';

class Grade {
  static create(student_id, subject_id, note) {
    const query = database.prepare('INSERT INTO grades (student_id, subject_id, note) VALUES (?, ?, ?)');
    return query.run(student_id, subject_id, note);
  }

  static getAll() {
    const query = database.prepare('SELECT * FROM grades');
    return query.all();
  }

  static getById(id) {
    const query = database.prepare('SELECT * FROM grades WHERE id = ?');
    return query.get(id);
  }

  static getByStudent(student_id) {
    const query = database.prepare('SELECT * FROM grades WHERE student_id = ?');
    return query.all(student_id);
  }

  static update(id, note) {
    const query = database.prepare('UPDATE grades SET note = ? WHERE id = ?');
    return query.run(note, id);
  }

  static delete(id) {
    const query = database.prepare('DELETE FROM grades WHERE id = ?');
    return query.run(id);
  }
}

export default Grade;