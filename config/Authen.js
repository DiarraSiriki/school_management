import User from '../models/modelUsers.js';
import Student from '../models/modelStudent.js';
import Teacher from '../models/teacher_models.js';
import logger from '../utils/logger.js';
import { ask } from './fct_utl_aff.js';

let currentUser = null;

export {
  authenticate,
  getUserProfile,
  login,
  getCurrentUser,
  setCurrentUser
};

/**
 * Authentifie un utilisateur par email et mot de passe
 * et retourne son profil complet (User + Données spécifiques Prof/Élève)
 */
function authenticate(email, mot_passe) {
  // 1. Récupération du compte utilisateur global
  const user = User.getByEmail(email);
  if (!user) {
    logger.warn(`Tentative de connexion échouée : email introuvable (${email})`);
    return null;
  }

  // 2. Vérification du mot de passe
  if (user.mot_passe !== mot_passe) {
    logger.warn(`Tentative de connexion échouée : mot de passe incorrect pour ${email}`);
    return null;
  }

  // 3. Récupération du profil lié selon le rôle
  const fullProfile = getUserProfile(user);

  logger.info(`Connexion réussie : ID=${user.id}, Rôle=${user.role}, Nom=${user.name}`);
  return fullProfile;
}

/**
 * Fonction interne/publique pour lier les infos de la table 'users' 
 * avec les détails de la table 'students' ou 'teachers'
 */
function getUserProfile(user) {
  if (!user) return null;

  // Copie des infos de base de l'utilisateur (sans le mot de passe pour la sécurité)
  const { mot_passe, ...userWithoutPassword } = user;
  let profileDetails = {};

  if (user.role === 'student' || user.role === 'etudiant') {
    // Nouvelle logique : on cherche par user_id dans la table students
    const studentInfo = Student.getByUserId(user.id);
    if (studentInfo) {
      profileDetails = {
        student_id: studentInfo.id,
        matricule: studentInfo.matricule,
        nom: studentInfo.nom,
        prenom: studentInfo.prenom,
        age: studentInfo.age,
        classe: studentInfo.classe
      };
    }
  } else if (user.role === 'teacher' || user.role === 'professeur') {
    // Nouvelle logique : on cherche par user_id dans la table teachers
    const teacherInfo = Teacher.getByUserId(user.id);
    if (teacherInfo) {
      profileDetails = {
        teacher_id: teacherInfo.id,
        nom: teacherInfo.nom,
        matiere: teacherInfo.matiere
      };
    }
  }

  // On fusionne les infos de compte (id, name, email, role) avec le profil métier
  return {
    ...userWithoutPassword,
    profile: profileDetails
  };
}

/**
 * Fonction de login interactive
 */
async function login() {
  console.log('\n  === CONNEXION ===');
  const email = await ask(' Veillez entrer votre mail : ');
  const mot_passe = await ask(' Veillez entrer votre mot de passe : ');
  
  const user = authenticate(email.trim(), mot_passe.trim());
  if (user) {
    setCurrentUser(user);
    console.log(`  Bienvenue, ${user.name} !\n`);
  } else {
    console.log('  Email ou mot de passe incorrect.\n');
  }
}

/**
 * Récupère l'utilisateur courant
 */
function getCurrentUser() {
  return currentUser;
}

/**
 * Définit l'utilisateur courant
 */
function setCurrentUser(user) {
  currentUser = user;
}