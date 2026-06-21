// 
// MENU MATIÈRES - Gestion des matières et affectation
// 

import * as matiereService from '../../services/matiereServive.js';
import * as professeurService from '../../services/teacherService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask,showMenu,printRows,parseId } from '../../config/fct_utl_aff.js';

async function menuMatieres() {
    showMenu(MENU_TITLES.subjects, MENUS.subjects);

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const nom = await ask(PROMPTS.subjectName);
            const teacherId = parseId(await ask(PROMPTS.teacherIdOptional));
            const id = matiereService.addSubject(nom.trim(), teacherId || null);
            console.log(`  Matière créée avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const matieres = matiereService.listSubjects();
            printRows('matière', matieres);
            break;
        }
        case '3': {
            const matieres = matiereService.listSubjects();
            printRows('matière', matieres);
            const teachers = professeurService.listTeachers();
            printRows('professeur', teachers);
            const subjectId = parseId(await ask(PROMPTS.subjectId));
            const professorId = parseId(await ask(PROMPTS.teacherId));
            if (!subjectId || !professorId) {
                console.log(MESSAGES.invalidId);
                break;
            }
            const subject = matiereService.getSubjectById(subjectId);
            if (!subject) {
                console.log(MESSAGES.subjectNotFound);
                break;
            }
            const ok = matiereService.updateSubject(subjectId, subject.nom, professorId);
            console.log(ok ? '  Professeur affecté à la matière.' : '  Affectation échouée.');
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}

export { menuMatieres };