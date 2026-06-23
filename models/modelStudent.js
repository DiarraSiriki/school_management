import database from '../db/database.js';

class Student {
  static create(matricule, nom, prenom, age, classe) {
    try {
      const query = database.prepare('INSERT INTO students (matricule, nom, prenom, age, classe) VALUES (?, ?, ?, ?, ?)');
      const result = query.run(matricule, nom, prenom, age, classe);
      database.exec('PRAGMA optimize');
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'insertion d\'un étudiant:', err.message);
      throw err;
    }
  }

  static getAll() {
    const query = database.prepare('SELECT * FROM students');
    return query.all();
  }

  static getById(id) {
    const query = database.prepare('SELECT * FROM students WHERE id = ?');
    return query.get(id);
  }

  static getByMatricule(matricule) {
    const query = database.prepare('SELECT * FROM students WHERE matricule = ?');
    return query.get(matricule);
  }

  static search(keyword) {
    const query = database.prepare(`
      SELECT * FROM students
      WHERE nom LIKE ? OR prenom LIKE ? OR matricule LIKE ?
    `);
    const k = `%${keyword}%`;
    return query.all(k, k, k);
  }

  static update(id, matricule, nom, prenom, age, classe) {
    const query = database.prepare(`
      UPDATE students SET matricule = ?, nom = ?, prenom = ?, age = ?, classe = ?
      WHERE id = ?
    `);
    return query.run(matricule, nom, prenom, age, classe, id);
  }

  static delete(id) {
    const query = database.prepare('DELETE FROM students WHERE id = ?');
    return query.run(id);
  }
}

export default Student;