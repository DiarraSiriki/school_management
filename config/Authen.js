import User from '../models/modelUsers.js';
import Student from '../models/modelStudent.js';
import Teacher from '../models/teacher_models.js';
import logger from '../utils/logger.js';
import { ask } from './fct_utl_aff.js';

let currentUser = null;


function authenticate(email, mot_passe) {
  const user = User.getByEmail(email);
  if (!user) {
    logger.warn(`Tentative de connexion échouée : email introuvable (${email})`);
    return null;
  }

  if (user.mot_passe !== mot_passe) {
    logger.warn(`Tentative de connexion échouée : mot de passe incorrect pour ${email}`);
    return null;
  }

  const fullProfile = getUserProfile(user);

  logger.info(`Connexion réussie : ID=${user.id}, Rôle=${user.role}, Nom=${user.name}`);
  return fullProfile;
}

function getUserProfile(user) {
  if (!user) return null;

  const { mot_passe, ...userWithoutPassword } = user;
  let profileDetails = {};

  if (user.role === 'student' || user.role === 'etudiant') {
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
    const teacherInfo = Teacher.getByUserId(user.id);
    if (teacherInfo) {
      profileDetails = {
        teacher_id: teacherInfo.id,
        nom: teacherInfo.nom,
        matiere: teacherInfo.matiere
      };
    }
  }

  return {
    ...userWithoutPassword,
    profile: profileDetails
  };
}

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

function getCurrentUser() {
  return currentUser;
}

function setCurrentUser(user) {
  currentUser = user;
}

export { authenticate,getUserProfile,login,getCurrentUser,setCurrentUser };