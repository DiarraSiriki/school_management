// 
// MENU UTILISATEURS - Gestion des comptes utilisateur (Admin uniquement)
// 

import * as userService from '../../services/userService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask,header,printMenu,separator,printRows,parseId } from '../../config/fct_utl_aff.js';

async function menuUtilisateurs() {
    header(MENU_TITLES.users);
    printMenu(MENUS.users);
    separator();

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const name = await ask(PROMPTS.name);
            const role = await ask(PROMPTS.role);
            const email = await ask(PROMPTS.email);
            const mot_de_passe = await ask(PROMPTS.password);
            const id = userService.addUser(name.trim(), role.trim(), email.trim(), mot_de_passe.trim());
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