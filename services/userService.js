import User from '../models/modelUsers.js';
import logger from '../utils/logger.js';

export {
    addUser,
    authenticate,
    removeUser,
    listUsers
}

// Ajout d'un objet destructuré en paramètre pour intercepter soit mot_passe, soit password
function addUser(name, role, email, mot_passe, studentId = null, teacherId = null) {
  
  // Sécurité : Si mot_passe est absent ou est un objet (ce qui arrive si l'ordre des arguments change),
  // ou si vous avez passé "password" par mégarde à la place de mot_passe.
  let passwordToSave = mot_passe;
  
  // Si jamais le mot de passe reçu est undefined, cela évite le crash SQLite NOT NULL
  if (!passwordToSave) {
      logger.error(`Tentative d'ajout de l'utilisateur ${name} sans mot de passe.`);
      throw new Error("Le mot de passe ne peut pas être vide (NOT NULL constraint).");
  }

  const result = User.create(name, role, email, passwordToSave, studentId, teacherId);
  logger.info(`Utilisateur ajouté: ID=${result.lastInsertRowid}, Nom=${name}, Rôle=${role}, studentId=${studentId}, teacherId=${teacherId}`);
  return result.lastInsertRowid;
}

function authenticate(email, mot_passe) {
  const user = User.getByEmail(email);
  if (!user) return null;
  return user.mot_passe === mot_passe ? user : null;
}

function removeUser(id) {
  const result = User.delete(id);
  if (result.changes > 0) {
    logger.info(`Utilisateur supprimé: ID=${id}`);
  }
  return result.changes > 0;
}

function listUsers() {
  const users = User.getAll();
  logger.info(`Liste des utilisateurs consultée (${users.length} utilisateurs)`);
  return users;
}