import database from '../db/database.js';

class Teacher {
    static create(nom, matiere) {
        const query = database.prepare('INSERT INTO teachers (nom, matiere) VALUES (?, ?)');
        return query.run(nom, matiere);
    }

    static getAll() {
        const query = database.prepare('SELECT * FROM teachers');
        return query.all();
    }

    static getById(id) {
        const query = database.prepare('SELECT * FROM teachers WHERE id = ?');
        return query.get(id);
    }

    static search(keyword) {
        const query = database.prepare(`
          SELECT * FROM teachers
          WHERE nom LIKE ? OR matiere LIKE ?
        `);
        const k = `%${keyword}%`;
        return query.all(k, k);
    }

    static update(id, nom, matiere) {
        const query = database.prepare(`
          UPDATE teachers SET nom = ?, matiere = ?
          WHERE id = ?
        `);
        return query.run(nom, matiere, id);
    }

    static delete(id) {
        const query = database.prepare('DELETE FROM teachers WHERE id = ?');
        return query.run(id);
    }
}

export default Teacher;