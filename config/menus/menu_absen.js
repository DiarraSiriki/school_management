import * as etudiantService from '../../services/studentService.js';
import * as absenceService from '../../services/absenceService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask, showMenu, printRows, resolveStudentId, parseId, header } from '../fct_utl_aff.js';
import { getCurrentUser } from '../Authen.js';

async function menuAbsences() {
    const user = getCurrentUser();

    // Pour étudiant : voir ses absences uniquement
    if (user && (user.role === 'student' || user.role === 'etudiant')) {
        header("MES ABSENCES");
        const history = absenceService.getStudentHistory(user.student_id);
        printRows('absence', history);
        await ask("\n  Appuyez sur Entrée pour revenir...");
        return;
    }

    // Pour professeur : menu limité (consulter absences des étudiants)
    if (user && (user.role === 'teacher' || user.role === 'professeur')) {
        header("CONSULTER LES ABSENCES");
        const profMenu = [
            '  1. Enregistrer une absence',
            '  2. Modifier le statut d\'une absence',
            '  3. Historique des absences d\'un étudiant',
            '  0. Retour'
        ];
        printMenu(profMenu);
        separator();
        
        const choix = await ask(PROMPTS.choice);
        switch (choix.trim()) {
            case '1': {
                const studentInput = await ask(PROMPTS.studentIdOrMatricule);
                const studentId = resolveStudentId(studentInput.trim());
                const date = await ask(PROMPTS.absenceDate);
                const statut = await ask(PROMPTS.absenceStatus);
                if (!studentId) {
                    console.log(MESSAGES.studentNotFound);
                    break;
                }
                const id = absenceService.recordAbsence(studentId, date.trim(), statut.trim());
                console.log(`  Absence enregistrée avec l'ID ${id}.`);
                break;
            }
            case '2': {
                const id = parseId(await ask(PROMPTS.absenceId));
                const statut = await ask(PROMPTS.newAbsenceStatus);
                const ok = id ? absenceService.updateAbsenceStatus(id, statut.trim()) : false;
                console.log(ok ? MESSAGES.statusModified : '  Modification échouée.');
                break;
            }
            case '3': {
                const studentInput = await ask(PROMPTS.studentIdOrMatricule);
                const studentId = resolveStudentId(studentInput.trim());
                if (!studentId) {
                    console.log(MESSAGES.studentNotFound);
                    break;
                }
                const history = absenceService.getStudentHistory(studentId);
                printRows('absence', history);
                break;
            }
            case '0': return;
            default: console.log(MESSAGES.invalidChoice);
        }
        return;
    }

    // Pour admin : menu complet
    showMenu(MENU_TITLES.absences, MENUS.absences);
    const choix = await ask(PROMPTS.choice);
    
    switch (choix.trim()) {
        case '1': {
            const studentInput = await ask(PROMPTS.studentIdOrMatricule);
            const studentId = resolveStudentId(studentInput.trim());
            const date = await ask(PROMPTS.absenceDate);
            const statut = await ask(PROMPTS.absenceStatus);
            if (!studentId) {
                console.log(MESSAGES.studentNotFound);
                break;
            }
            const id = absenceService.recordAbsence(studentId, date.trim(), statut.trim());
            console.log(`  Absence enregistrée avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const id = parseId(await ask(PROMPTS.absenceId));
            const statut = await ask(PROMPTS.newAbsenceStatus);
            const ok = id ? absenceService.updateAbsenceStatus(id, statut.trim()) : false;
            console.log(ok ? MESSAGES.statusModified : '  Modification échouée.');
            break;
        }
        case '3': {
            const studentInput = await ask(PROMPTS.studentIdOrMatricule);
            const studentId = resolveStudentId(studentInput.trim());
            if (!studentId) {
                console.log(MESSAGES.studentNotFound);
                break;
            }
            const history = absenceService.getStudentHistory(studentId);
            printRows('absence', history);
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}

export { menuAbsences };