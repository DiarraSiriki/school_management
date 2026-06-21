// 
// MENU PRINCIPAL - Gestion des choix utilisateur
// 

import logger from '../../utils/logger.js';
import { MENU_TITLES, PROMPTS, MESSAGES } from '../constents.js';
import { login, isAdminRole, isTeacherRole, isStudentRole, getCurrentUser, setCurrentUser } from '../Authen.js';
import { ask, header, printMenu, separator, rl } from '../fct_utl_aff.js';
import { menuUtilisateurs } from '../menus/menu_user.js';
import { menuEtudiants } from '../menus/menu_etudi.js';
import { menuProfesseurs } from '../menus/menu_prof.js';
import { menuMatieres } from '../menus/menu_matieres.js';
import { menuNotes } from '../menus/menu_notes.js';
import { menuAbsences } from '../menus/menu_absen.js';
import { menuStats } from '../menus/menu_stat.js';



function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && isAdminRole(currentUser.role);
}

function isTeacher() {
    const currentUser = getCurrentUser();
    return currentUser && isTeacherRole(currentUser.role);
}

function isStudent() {
    const currentUser = getCurrentUser();
    return currentUser && isStudentRole(currentUser.role);
}


function getMainMenuForRole() {
    const currentUser = getCurrentUser();
    if (!currentUser) return ['  1. Se connecter', '  0. Quitter'];
    const role = currentUser.role;
    if (role === 'admin') return [
        '  1. Utilisateurs',
        '  2. Étudiants',
        '  3. Professeurs',
        '  4. Matières',
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ];
    if (role === 'professeur') return [
        '  2. Étudiants',
        '  4. Matières',
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ];
    if (role === 'etudiant') return [
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ];
    return ['  0. Quitter'];
}

async function menuPrincipal() {
    while (true) {
        const currentUser = getCurrentUser();
        if (currentUser) {
            header(`${MENU_TITLES.main} - ${currentUser.name} (${currentUser.role})`);
        } else {
            header(MENU_TITLES.main);
        }
        const menu = getMainMenuForRole();
        printMenu(menu);
        separator();

        const choix = await ask(PROMPTS.choice);

        if (!currentUser) {
            switch (choix.trim()) {
                case '1': await login(); break;
                case '0':
                    logger.info(MESSAGES.appClosed);
                    console.log(MESSAGES.goodbye);
                    rl.close();
                    process.exit(0);
                default:
                    console.log(MESSAGES.invalidChoice);
            }
            continue;
        }

        switch (choix.trim()) {
            case '1': await menuUtilisateurs(); break;
            case '2': await menuEtudiants(); break;
            case '3': await menuProfesseurs(); break;
            case '4': await menuMatieres(); break;
            case '5': await menuNotes(); break;
            case '6': await menuAbsences(); break;
            case '7': await menuStats(); break;
            case '9':
                logger.info(`Déconnexion: ${currentUser.name} (${currentUser.role})`);
                console.log('\n  Au revoir ' + currentUser.name + '!\n');
                setCurrentUser(null);
                break;
            case '0':
                logger.info(MESSAGES.appClosed);
                console.log(MESSAGES.goodbye);
                rl.close();
                process.exit(0);
            default:
                console.log(MESSAGES.invalidChoice);
        }
    }
}



export { menuPrincipal as Menu_principal };



