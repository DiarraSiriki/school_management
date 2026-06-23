import * as professeurService from '../../services/teacherService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask, showMenu, printRows, parseId } from '../../config/fct_utl_aff.js';
import { getCurrentUser, isTeacherRole } from '../Authen.js';

async function menuProfesseurs() {
    const user = getCurrentUser();

    // Restreindre l'affichage si c'est le professeur lui-même qui navigue
    if (user && isTeacherRole(user.role)) {
        header("MON PROFIL ENSEIGNANT");
        if (!user.teacher_id) {
            console.log("  Aucun profil enseignant lié à votre compte.");
            return;
        }
        const visual = professeurService.getTeacherById(user.teacher_id);
        printRows('professeur', visual ? [visual] : []);
        await ask("\n  Appuyez sur Entrée pour revenir...");
        return;
    }

    showMenu(MENU_TITLES.teachers, MENUS.teachers);
    const choix = await ask(PROMPTS.choice);
    
    switch (choix.trim()) {
        case '1': {
            const nom = await ask(PROMPTS.name);
            const matiere = await ask(PROMPTS.teacherSubject);
            const email = await ask(PROMPTS.email);
            const password = await ask(PROMPTS.password);
            const id = professeurService.addTeacher(nom.trim(), matiere.trim(), email.trim(), password.trim());
            console.log(`  Professeur créé avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const teachers = professeurService.listTeachers();
            printRows('professeur', teachers);
            const id = parseId(await ask(PROMPTS.teacherId));
            if (!id) {
                console.log(MESSAGES.invalidId);
                break;
            }
            const nom = await ask(PROMPTS.name);
            const matiere = await ask(PROMPTS.teacherSubject);
            const ok = professeurService.updateTeacher(id, nom.trim(), matiere.trim());
            console.log(ok ? '  Professeur modifié.' : '  Modification échouée.');
            break;
        }
        case '3': {
            const teachers = professeurService.listTeachers();
            printRows('professeur', teachers);
            const id = parseId(await ask(PROMPTS.teacherId));
            const ok = id ? professeurService.removeTeacher(id) : false;
            console.log(ok ? '  Professeur supprimé.' : '  Suppression échouée.');
            break;
        }
        case '4': {
            const terme = await ask(PROMPTS.searchTerm);
            const results = professeurService.searchTeacher(terme.trim());
            printRows('professeur', results);
            break;
        }
        case '5': {
            const teachers = professeurService.listTeachers();
            printRows('professeur', teachers);
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}

export { menuProfesseurs };