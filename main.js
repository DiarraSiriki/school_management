
// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 1 : IMPORTS - Chargement des dépendances et modules
// ═══════════════════════════════════════════════════════════════════════════════

import './db/database.js';
import logger from './logs/loger.js';
import * as userService from './services/userService.js';
import * as etudiantService from './services/studentService.js';
import * as professeurService from './services/teacherService.js';
import * as matiereService from './services/matiereServive.js';
import * as noteService from './services/gradeService.js';
import * as absenceService from './services/absenceService.js';
import * as statsService from './services/statisService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from './config/constents.js';
import { normalizeRole, getMenuForRole, isAdminRole, isTeacherRole, isStudentRole } from './config/Authen.js';
import {
    ask,
    header,
    separator,
    showMenu,
    printMenu,
    printRows,
    parseId,
    resolveStudentId
} from './utils/fct_utl_aff.js';
import { menuUtilisateurs } from './config/menus/menu_user.js';
import { menuEtudiants } from './config/menus/menu_etudi.js';
import { menuProfesseurs } from './config/menus/menu_prof.js';
import { menuMatieres } from './config/menus/menu_matieres.js';
import { menuNotes } from './config/menus/menu_notes.js';
import { menuAbsences } from './config/menus/menu_absen.js';
import { menuStats } from './config/menus/menu_stat.js';
import {Menu_principal} from './Menu_principal.js';



// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 2 : VARIABLE GLOBALE - État de l'utilisateur connecté
// ═══════════════════════════════════════════════════════════════════════════════

let currentUser = null;

function isAdmin() {
    return currentUser && isAdminRole(currentUser.role);
}

function isTeacher() {
    return currentUser && isTeacherRole(currentUser.role);
}

function isStudent() {
    return currentUser && isStudentRole(currentUser.role);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 3 : AUTHENTIFICATION - Connexion de l'utilisateur
// ═══════════════════════════════════════════════════════════════════════════════

async function login() {
    while (!currentUser) {
        header('CONNEXION');
        const email = await ask(PROMPTS.loginEmail);
        const mot_de_passe = await ask(PROMPTS.loginPassword);
        const utilisateur = userService.authenticate(email.trim(), mot_de_passe.trim());
        if (utilisateur) {
            currentUser = {
                ...utilisateur,
                role: normalizeRole(utilisateur.role)
            };
            logger.info(`Connexion réussie: ${currentUser.name} (${currentUser.role})`);
            console.log(`\n  Bienvenue ${currentUser.name} (${currentUser.role})\n`);
            return;
        }
        console.log(MESSAGES.invalidCredentials);
    }
}



// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 8 : MENU PRINCIPAL - Routage selon le rôle de l'utilisateur
// ═══════════════════════════════════════════════════════════════════════════════

async function handleMainMenu() {
    const menu = getMenuForRole(currentUser ? currentUser.role : '');
    showMenu(MENU_TITLES.main, menu);

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1':
            if (!isAdmin()) {
                console.log(MESSAGES.accessDenied);
                break;
            }
            await menuUtilisateurs();
            break;
        case '2':
            if (!isAdmin() && !isTeacher()) {
                console.log(MESSAGES.accessDenied);
                break;
            }
            await menuEtudiants();
            break;
        case '3':
            if (!isAdmin()) {
                console.log(MESSAGES.accessDenied);
                break;
            }
            await menuProfesseurs();
            break;
        case '4':
            if (!isAdmin() && !isTeacher()) {
                console.log(MESSAGES.accessDenied);
                break;
            }
            await menuMatieres();
            break;
        case '5':
            if (!isAdmin() && !isTeacher() && !isStudent()) {
                console.log(MESSAGES.accessDenied);
                break;
            }
            await menuNotes();
            break;
        case '6':
            if (!isAdmin() && !isTeacher() && !isStudent()) {
                console.log(MESSAGES.accessDenied);
                break;
            }
            await menuAbsences();
            break;
        case '7':
            if (!isAdmin() && !isTeacher() && !isStudent()) {
                console.log(MESSAGES.accessDenied);
                break;
            }
            await menuStats();
            break;
        case '9':
            currentUser = null;
            logger.info('Déconnexion');
            console.log('  Déconnecté.\n');
            return;
        case '0':
            console.log(MESSAGES.goodbye);
            process.exit(0);
        default:
            console.log(MESSAGES.invalidChoice);
    }
}



// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9 : BOUCLE PRINCIPALE - Gestion du flux de l'application
// ═══════════════════════════════════════════════════════════════════════════════

async function menuPrincipal() {
    while (true) {
        try {
            if (!currentUser) {
                await login();
            } else {
                await handleMainMenu();
            }
        } catch (err) {
            logger.error(`Erreur : ${err.message}`);
            console.error('  Erreur :', err.message);
        }
    }
}



// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 10 : POINT D'ENTRÉE - Démarrage de l'application
// ═══════════════════════════════════════════════════════════════════════════════

(async () => {
    try {
        logger.info('Application démarrée');
        await menuPrincipal();
    } catch (err) {
        logger.error(`Erreur fatale : ${err.message}`);
        console.error('Erreur fatale :', err.message);
        process.exit(1);
    }
})();
