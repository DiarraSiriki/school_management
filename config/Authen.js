import logger from '../utils/logger.js';
import { ask, header } from './fct_utl_aff.js';
import { PROMPTS, MESSAGES } from './constents.js';
import * as userService from '../services/userService.js';

let currentUser = null;

export function setCurrentUser(user) {
    currentUser = user;
}

export function getCurrentUser() {
    return currentUser;
}

export const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'professeur',
    STUDENT: 'etudiant'
};

export const MENU_BY_ROLE = {
    [ROLES.ADMIN]: [
        '  1. Utilisateurs',
        '  2. Étudiants',
        '  3. Professeurs',
        '  4. Matières',
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ],
    [ROLES.TEACHER]: [
        '  2. Étudiants',
        '  4. Matières',
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ],
    [ROLES.STUDENT]: [
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ]
};


//
// AUTHENTIFICATION - Connexion de l'utilisateur
// 

export async function login() {
    while (!currentUser) {
        header('CONNEXION');
        const email = await ask(PROMPTS.loginEmail);
        const mot_de_passe = await ask(PROMPTS.loginPassword);
        const utilisateur = userService.authenticate(email.trim(), mot_de_passe.trim());
        if (utilisateur) {
            const user = {
                ...utilisateur,
                role: normalizeRole(utilisateur.role)
            };
            setCurrentUser(user);
            logger.info(`Connexion réussie: ${user.name} (${user.role})`);
            console.log(`\n  Bienvenue ${user.name} (${user.role})\n`);
            return;
        }
        console.log(MESSAGES.invalidCredentials);
    }
}


export function normalizeRole(role) {
    if (!role || typeof role !== 'string') return '';
    const value = role.trim().toLowerCase();
    if (value === 'admin') return ROLES.ADMIN;
    if (value === 'professeur' || value === 'prof') return ROLES.TEACHER;
    if (value === 'etudiant' || value === 'étudiant' || value === 'student') return ROLES.STUDENT;
    return value;
}

export function isAdminRole(role) {
    return normalizeRole(role) === ROLES.ADMIN;
}

export function isTeacherRole(role) {
    return normalizeRole(role) === ROLES.TEACHER;
}

export function isStudentRole(role) {
    return normalizeRole(role) === ROLES.STUDENT;
}

export function getMenuForRole(role) {
    const normalized = normalizeRole(role);
    return MENU_BY_ROLE[normalized] || ['  0. Quitter'];
}
