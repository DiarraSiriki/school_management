import * as userService from '../../services/userService.js';
import { MENU_TITLES, MENUS, PROMPTS } from '../constents.js';
import { ask, header, printMenu, separator, printRows, parseId } from '../fct_utl_aff.js';

async function menuUtilisateurs() {
    header(MENU_TITLES.users);
    printMenu(MENUS.users);
    separator();

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const name = await ask(PROMPTS.name);
            const roleInput = await ask(PROMPTS.role);
            const role = roleInput.trim().toLowerCase();
            const email = await ask(PROMPTS.email);
            const mot_de_passe = await ask(PROMPTS.password);

            if (role === 'student' || role === 'etudiant' || role === 'teacher' || role === 'professeur') {
                console.log("  [Info] Pour créer un étudiant, utilisez le menu 'Étudiants' (option 2 du menu principal).");
                console.log("  [Info] Pour créer un professeur, utilisez le menu 'Professeurs' (option 3 du menu principal).");
                console.log("  Ce menu 'Utilisateurs' est réservé aux comptes administratifs uniquement.");
                break;
            }

            const id = userService.addUser(name.trim(), role, email.trim(), mot_de_passe.trim());
            console.log(`  Utilisateur créé avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const users = userService.listUsers();
            printRows('utilisateur', users);
            const id = await ask(PROMPTS.userDeleteId);
            const ok = userService.removeUser(parseId(id));
            console.log(ok ? '  Utilisateur supprimé.' : '  Utilisateur introuvable.');
            break;
        }
        case '3': {
            const users = userService.listUsers();
            printRows('utilisateur', users);
            break;
        }
        case '0': return;
        default: console.log('  Choix invalide.\n');
    }
}

export { menuUtilisateurs };
