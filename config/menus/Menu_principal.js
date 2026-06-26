

import logger from '../../utils/logger.js';

import { MENU_TITLES, PROMPTS, MESSAGES } from '../constents.js'; 
import { login, getCurrentUser, setCurrentUser } from '../Authen.js';
import { ask, header, printMenu, separator, rl } from '../fct_utl_aff.js';

// Importations des sous-menus depuis le même dossier
import { menuUtilisateurs } from './menu_user.js';
import { menuEtudiants } from './menu_etudi.js';
import { menuProfesseurs } from './menu_prof.js';
import { menuMatieres } from './menu_matieres.js';
import { menuNotes } from './menu_notes.js';
import { menuAbsences } from './menu_absen.js';
import { menuStats } from './menu_stat.js';

/**
 * Génère les options d'affichage dynamiquement selon le rôle de la session active
 */
function getMainMenuForRole() {
    const currentUser = getCurrentUser();
    if (!currentUser) return ['  1. Se connecter', '  0. Quitter'];
    
    const role = currentUser.role.toLowerCase();
    
    if (role === 'admin') {
        return [
            '  1. Gestion des utilisateurs',
            '  2. Gestion des étudiants (crée automatiquement le compte)',
            '  3. Gestion des professeurs (crée automatiquement le compte)',
            '  4. Gestion des matières',
            '  5. Gestion des notes',
            '  6. Gestion des absences',
            '  7. Consulter les statistiques',
            '  8. Se déconnecter',
            '  0. Quitter'
        ];
    }
    
    if (role === 'professeur' || role === 'teacher') {
        return [
            '  1. Consulter les étudiants',
            '  2. Consulter les matières',
            '  3. Gestion des notes (Ajouter/Modifier/Moyennes)', // <-- Libellé plus précis
            '  4. Consulter les absences',
            '  5. Voir les statistiques & Classements', // <-- AJOUT : Pour calculer les moyennes/bilans étudiants
            '  6. Se déconnecter',
            '  0. Quitter'
        ];
    }
    
    if (role === 'etudiant' || role === 'student') {
        return [
            '  1. Voir mes notes',
            '  2. Voir mes absences',
            '  3. Voir ma moyenne', 
            '  4. Se déconnecter',
            '  0. Quitter'
        ];
    }
    
    return ['  0. Quitter'];
}

/**
 * Menu de sélection du rôle avant la connexion effective
 */
async function choisirRoleConnexion() {
    while (true) {
        header("SÉLECTIONNER VOTRE ESPACE");
        printMenu([
            '  1. Espace Administrateur',
            '  2. Espace Professeur',
            '  3. Espace Étudiant',
            '  0. Retour au menu principal'
        ]);
        separator();

        const choixRole = (await ask(PROMPTS.choice)).trim();

        switch (choixRole) {
            case '1':
            case '2':
            case '3':
                await login();
                return;
            case '0':
                return; 
            default:
                console.log(MESSAGES.invalidChoice);
        }
    }
}

/**
 * Boucle principale de l'application CLI
 */
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

        // 1. GESTION DES UTILISATEURS NON CONNECTÉS
        if (!currentUser) {
            switch (choix) {
                case '1': 
                    await choisirRoleConnexion(); 
                    break;
                case '0': 
                    fermerApplication(); 
                    break;
                default: 
                    console.log(MESSAGES.invalidChoice);
            }
            continue;
        }

        // 2. AIGUILLAGE SÉCURISÉ SELON LE RÔLE DÉTECTÉ
        const role = currentUser.role.toLowerCase();

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
        else if (role === 'professeur' || role === 'teacher') {
            switch (choix) {
                case '1': await menuEtudiants(); break;  
                case '2': await menuMatieres(); break;   
                case '3': await menuNotes(); break;      
                case '4': await menuAbsences(); break;   
                case '5': await menuStats(); break; // <-- AJOUT : Permet au prof d'accéder au menuStats adapté
                case '6': deconnexion(currentUser); break;
                case '0': fermerApplication(); break;
                default: console.log(MESSAGES.invalidChoice);
            }
        } 
        else if (role === 'etudiant' || role === 'student') {
            switch (choix) {
                case '1': await menuNotes(); break;      
                case '2': await menuAbsences(); break;   
                case '3': await menuStats(); break;      
                case '4': deconnexion(currentUser); break;
                case '0': fermerApplication(); break;
                default: console.log(MESSAGES.invalidChoice);
            }
        } else {
            if (choix === '0') fermerApplication();
            else console.log(MESSAGES.invalidChoice);
        }
    }
}

/**
 * Déconnecte proprement l'utilisateur actuel
 */
function deconnexion(user) {
    logger.info(`Déconnexion: ${user.name}`);
    console.log(`\n  Au revoir ${user.name} !\n`);
    setCurrentUser(null);
}

/**
 * Arrête l'application de manière sécurisée
 */
function fermerApplication() {
    logger.info(MESSAGES.appClosed);
    rl.close();
    process.exit(0);
}

export { menuPrincipal as Menu_principal };