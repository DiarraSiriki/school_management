import * as userService from '../../services/userService.js';
import * as etudiantService from '../../services/studentService.js';
import * as professeurService from '../../services/teacherService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask, header, printMenu, separator, printRows, parseId } from '../../config/fct_utl_aff.js';
import { normalizeRole, ROLES } from '../Authen.js';

async function menuUtilisateurs() {
    header(MENU_TITLES.users);
    printMenu(MENUS.users);
    separator();

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const name = await ask(PROMPTS.name);
            const roleInput = await ask(PROMPTS.role);
            const role = normalizeRole(roleInput);
            const email = await ask(PROMPTS.email);
            const mot_de_passe = await ask(PROMPTS.password);
            
            let studentId = null;
            let teacherId = null;

            if (role === ROLES.STUDENT) {
                const sInput = await ask("  ID de l'étudiant à lier : ");
                const targetId = parseId(sInput);
                if(targetId && etudiantService.getStudentById(targetId)) {
                    studentId = targetId;
                } else {
                    console.log("  [Attention] ID Étudiant introuvable. Compte créé sans liaison.");
                }
            } else if (role === ROLES.TEACHER) {
                const tInput = await ask("  ID du professeur à lier : ");
                const targetId = parseId(tInput);
                if(targetId && professeurService.getTeacherById(targetId)) {
                    teacherId = targetId;
                } else {
                    console.log("  [Attention] ID Professeur introuvable. Compte créé sans liaison.");
                }
            }

            const id = userService.addUser(name.trim(), role, email.trim(), mot_de_passe.trim(), studentId, teacherId);
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