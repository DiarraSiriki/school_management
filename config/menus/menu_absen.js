// 
// MENU ABSENCES - Enregistrement et consultation des absences
// 

import * as etudiantService from '../../services/studentService.js';
import * as absenceService from '../../services/absenceService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import {ask,showMenu,printRows,resolveStudentId,parseId} from '../../config/fct_utl_aff.js';

async function menuAbsences() {
    showMenu(MENU_TITLES.absences, MENUS.absences);

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const students = etudiantService.listStudents();
            printRows('étudiant', students);
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
            const absences = absenceService.getHistory();
            printRows('absence', absences);
            const id = parseId(await ask(PROMPTS.absenceId));
            const statut = await ask(PROMPTS.newAbsenceStatus);
            const ok = id ? absenceService.updateAbsenceStatus(id, statut.trim()) : false;
            console.log(ok ? MESSAGES.statusModified : '  Modification échouée.');
            break;
        }
        case '3': {
            const students = etudiantService.listStudents();
            printRows('étudiant', students);
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