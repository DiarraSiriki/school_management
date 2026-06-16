import User from '../models/modelUsers.js';
import logger from '../logs/loger.js';

export function addUser(name, role, email, mot_passe) {
  const result = User.create(name, role, email, mot_passe);
  logger.info(`Utilisateur ajouté: ID=${result.lastInsertRowid}, Nom=${name}, Rôle=${role}`);
  return result.lastInsertRowid;
}

export function authenticate(email, mot_passe) {
  const user = User.getByEmail(email);
  if (!user) return null;
  return user.mot_passe === mot_passe ? user : null;
}

export function removeUser(id) {
  const result = User.delete(id);
  if (result.changes > 0) {
    logger.info(`Utilisateur supprimé: ID=${id}`);
  }
  return result.changes > 0;
}

export function listUsers() {
  const users = User.getAll();
  logger.info(`Liste des utilisateurs consultée (${users.length} utilisateurs)`);
  return users;
}

