import logger from '../../utils/logger.js';
import { MENU_TITLES, PROMPTS, MESSAGES } from '../constents.js';
import { login, getCurrentUser, setCurrentUser } from '../Authen.js';
import { ask, header, printMenu, separator, rl } from '../fct_utl_aff.js';
import { menuUtilisateurs } from '../menus/menu_user.js';
import { menuEtudiants } from '../menus/menu_etudi.js';
import { menuProfesseurs } from '../menus/menu_prof.js';
import { menuMatieres } from '../menus/menu_matieres.js';
import { menuNotes } from '../menus/menu_notes.js';
import { menuAbsences } from '../menus/menu_absen.js';
import { menuStats } from '../menus/menu_stat.js';

function getMainMenuForRole() {
    const currentUser = getCurrentUser();
    if (!currentUser) return ['  1. Se connecter', '  0. Quitter'];
    const role = currentUser.role;
    
    // Titres exacts mis à jour selon vos spécifications
    if (role === 'admin') return [
        '  1. Gérer les utilisateurs',
        '  2. Gérer les étudiants',
        '  3. Gérer les professeurs',
        '  4. Gérer les matières',
        '  5. Gérer les notes',
        '  6. Gérer les absences',
        '  7. Consulter les statistiques',
        '  8. Se déconnecter',
        '  0. Quitter'
    ];
    if (role === 'professeur') return [
        '  1. Consulter les étudiants',
        '  2. Consulter les matières',
        '  3. Ajouter/Modifier des notes',
        '  4. Consulter les absences',
        '  5. Se déconnecter',
        '  0. Quitter'
    ];
    if (role === 'etudiant') return [
        '  1. Voir ses notes',
        '  2. Voir ses absences',
        '  3. Voir sa moyenne',
        '  4. Se déconnecter',
        '  0. Quitter'
    ];
    return ['  0. Quitter'];
}

async function menuPrincipal() {
    while (true) {
        const currentUser = getCurrentUser();
        if (currentUser) {
            header(`${MENU_TITLES.main} - ${currentUser.name} (${currentUser.role.toUpperCase()})`);
        } else {
            header(MENU_TITLES.main);
        }
        
        const menu = getMainMenuForRole();
        printMenu(menu);
        separator();

        const choix = (await ask(PROMPTS.choice)).trim();

        // 1. GESTION SI NON CONNECTÉ
        if (!currentUser) {
            switch (choix) {
                case '1': await login(); break;
                case '0': fermerApplication(); break;
                default: console.log(MESSAGES.invalidChoice);
            }
            continue;
        }

        // 2. GESTION SÉCURISÉE DES CAS SELON LE RÔLE
        const role = currentUser.role;

        if (role === 'admin') {
            switch (choix) {
                case '1': await menuUtilisateurs(); break;
                case '2': await menuEtudiants(); break;
                case '3': await menuProfesseurs(); break;
                case '4': await menuMatieres(); break;
                case '5': await menuNotes(); break;
                case '6': await menuAbsences(); break;
                case '7': await menuStats(); break;
                case '8': deconnexion(currentUser); break;
                case '0': fermerApplication(); break;
                default: console.log(MESSAGES.invalidChoice);
            }
        } 
        else if (role === 'professeur') {
            switch (choix) {
                case '1': await menuEtudiants(); break;  // Le menu étudiant interne filtrera pour n'autoriser que la consultation
                case '2': await menuMatieres(); break;   // Consultation
                case '3': await menuNotes(); break;      // Ajout / Modification
                case '4': await menuAbsences(); break;   // Consultation
                case '5': deconnexion(currentUser); break;
                case '0': fermerApplication(); break;
                default: console.log(MESSAGES.invalidChoice);
            }
        } 
        else if (role === 'etudiant') {
            switch (choix) {
                case '1': await menuNotes(); break;      // Voir ses notes (L'ID étudiant connecté devra filtrer les requêtes)
                case '2': await menuAbsences(); break;   // Voir ses absences
                case '3': await menuStats(); break;      // Voir sa moyenne
                case '4': deconnexion(currentUser); break;
                case '0': fermerApplication(); break;
                default: console.log(MESSAGES.invalidChoice);
            }
        }
    }
}

// Fonctions utilitaires internes pour alléger le switch
function deconnexion(user) {
    logger.info(`Déconnexion: ${user.name}`);
    console.log(`\n  Au revoir ${user.name} !\n`);
    setCurrentUser(null);
}

function fermerApplication() {
    logger.info(MESSAGES.appClosed);
    rl.close();
    process.exit(0);
}

export { menuPrincipal as Menu_principal };