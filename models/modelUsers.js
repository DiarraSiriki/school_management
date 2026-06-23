import database from '../db/database.js';

class User {
  // Les IDs optionnels reçoivent la valeur null par défaut
  static create(name, role, email, mot_passe, student_id = null, teacher_id = null) {
    const query = database.prepare(
      'INSERT INTO users (name, role, email, mot_passe, student_id, teacher_id) VALUES (?, ?, ?, ?, ?, ?)'
    );
    return query.run(name, role, email, mot_passe, student_id, teacher_id);
  }

  static getAll() {
    const query = database.prepare('SELECT * FROM users');
    return query.all();
  }

  static getById(id) {
    const query = database.prepare('SELECT * FROM users WHERE id = ?');
    return query.get(id);
  }

  static getByEmail(email) {
    const query = database.prepare('SELECT * FROM users WHERE email = ?');
    return query.get(email);
  }

  static delete(id) {
    const query = database.prepare('DELETE FROM users WHERE id = ?');
    return query.run(id);
  }
}

export default User;