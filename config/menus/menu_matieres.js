import * as matiereService from '../../services/matiereServive.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask, showMenu, printRows, parseId, header } from '../fct_utl_aff.js';
import { getCurrentUser } from '../Authen.js';

async function menuMatieres() {
    const user = getCurrentUser();

    // Pour professeur : consultation uniquement
    if (user && (user.role === 'teacher' || user.role === 'professeur')) {
        header("CONSULTER LES MATIÈRES");
        const matieres = matiereService.listSubjects();
        printRows('matière', matieres);
        await ask("\n  Appuyez sur Entrée pour revenir...");
        return;
    }

    // Pour admin : menu complet
    showMenu(MENU_TITLES.subjects, MENUS.subjects);
    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const nom = await ask(PROMPTS.subjectName);
            const classe = await ask(PROMPTS.classe);
            const teacherId = parseId(await ask(PROMPTS.teacherIdOptional));
            const id = matiereService.addSubject(nom.trim(), classe.trim(), teacherId || null);
            console.log(`  Matière créée avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const matieres = matiereService.listSubjects();
            printRows('matière', matieres);
            const subjectId = parseId(await ask(PROMPTS.subjectId));
            if (!subjectId) return console.log(MESSAGES.invalidId);
            
            const nNom = await ask(PROMPTS.subjectName);
            const nClasse = await ask(PROMPTS.classe);
            const nProfId = parseId(await ask(PROMPTS.teacherIdOptional));
            
            const ok = matiereService.updateSubject(subjectId, nNom.trim(), nClasse.trim(), nProfId);
            console.log(ok ? '  Matière mise à jour.' : '  Modification échouée.');
            break;
        }
        case '3': {
            const matieres = matiereService.listSubjects();
            printRows('matière', matieres);
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}

export { menuMatieres };