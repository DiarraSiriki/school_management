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
        '  8. Se déconnecter',
        '  0. Quitter'
    ],
    [ROLES.TEACHER]: [
        '  1. Étudiants',
        '  2. Matières',
        '  3. Notes',
        '  4. Absences',
        '  5. Statistiques',
        '  6. Se déconnecter',
        '  0. Quitter'
    ],
    [ROLES.STUDENT]: [
        '  1. Notes',
        '  2. Absences',
        '  3. Statistiques',
        '  4. Se déconnecter',
        '  0. Quitter'
    ]
};

//
// AUTHENTIFICATION - Connexion de l'utilisateur avec sélection du rôle
// 
export async function login() {
    while (!currentUser) {
        header('CONNEXION');
        
        // 1. Demande du profil / rôle
        console.log("  Sélectionnez votre profil :");
        console.log("  1. Administrateur");
        console.log("  2. Professeur");
        console.log("  3. Étudiant");
        
        const choixProfil = await ask("\n  Votre choix (1-3) : ");
        let roleRecherche = '';
        
        switch (choixProfil.trim()) {
            case '1':
                roleRecherche = ROLES.ADMIN;
                break;
            case '2':
                roleRecherche = ROLES.TEACHER;
                break;
            case '3':
                roleRecherche = ROLES.STUDENT;
                break;
            default:
                console.log("  Choix de profil invalide. Veuillez réessayer.\n");
                continue; // Relance la boucle de connexion
        }

        // 2. Demande des identifiants de connexion
        console.log(`\n  --- Connexion Espace [${roleRecherche.toUpperCase()}] ---`);
        const email = await ask(PROMPTS.loginEmail);
        const mot_de_passe = await ask(PROMPTS.loginPassword);
        
        const utilisateur = userService.authenticate(email.trim(), mot_de_passe.trim());
        
        // 3. Vérification des identifiants ET correspondance du rôle sélectionné
        if (utilisateur && normalizeRole(utilisateur.role) === roleRecherche) {
            const user = {
                ...utilisateur,
                role: normalizeRole(utilisateur.role) // Centralise le rôle en français ('etudiant' ou 'professeur')
            };
            setCurrentUser(user);
            logger.info(`Connexion réussie: ${user.name} (${user.role}) | student_id: ${user.student_id} | teacher_id: ${user.teacher_id}`);
            console.log(`\n  Bienvenue ${user.name} (${user.role})\n`);
            return;
        }
        
        // Si les identifiants sont faux ou si le compte n'a pas le rôle demandé
        console.log("\n  [Erreur] Identifiants incorrects ou rôle non autorisé pour ce compte.\n");
    }
}

export function normalizeRole(role) {
    if (!role || typeof role !== 'string') return '';
    const value = role.trim().toLowerCase();
    if (value === 'admin') return ROLES.ADMIN;
    if (value === 'professeur' || value === 'prof' || value === 'teacher') return ROLES.TEACHER;
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
    const normalized = normalizeRole(role); // Correction de la variable 'normaliazed'
    return MENU_BY_ROLE[normalized] || ['  0. Quitter'];
}