// ============================================================
// db/database.js
// ============================================================

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const dbPath     = join(__dirname, 'database.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

console.log(`Base de donnees connectee : ${dbPath}`);

// ------------------------------------------------------------
// TABLE USERS  (table de base — creee en premier)
// user_id dans students/teachers pointe ici
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    role       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    mot_passe  TEXT    NOT NULL,
    student_id INTEGER UNIQUE REFERENCES students(id) ON DELETE SET NULL,
    teacher_id INTEGER UNIQUE REFERENCES teachers(id) ON DELETE SET NULL
  )
`);

// ------------------------------------------------------------
// TABLE STUDENTS
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    matricule TEXT    NOT NULL UNIQUE,
    nom       TEXT    NOT NULL,
    prenom    TEXT    NOT NULL,
    age       INTEGER NOT NULL,
    classe    TEXT    NOT NULL
  )
`);

// ------------------------------------------------------------
// TABLE TEACHERS
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS teachers (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nom     TEXT NOT NULL,
    matiere TEXT NOT NULL
  )
`);

// ------------------------------------------------------------
// TABLE SUBJECTS
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nom        TEXT    NOT NULL,
    teacher_id INTEGER,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
  )
`);

// ------------------------------------------------------------
// TABLE GRADES
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS grades (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    note       REAL    NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  )
`);

// ------------------------------------------------------------
// TABLE ABSENCES
// ------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS absences (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date       TEXT    NOT NULL,
    status     TEXT    NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
  )
`);

export default db;