// 
// MENU STATISTIQUES - Consultation des données statistiques
// 

import * as etudiantService from '../../services/studentService.js';
import * as statsService from '../../services/statisService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import {ask,showMenu,printRows,resolveStudentId} from '../../config/fct_utl_aff.js';

async function menuStats() {
    showMenu(MENU_TITLES.stats, MENUS.stats);

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const best = statsService.getBestStudent();
            if (!best) {
                console.log(MESSAGES.noStudent);
                break;
            }
            console.table([best]);
            break;
        }
        case '2': {
            const average = statsService.getGeneralAverage();
            console.log(`  Moyenne générale : ${average}`);
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
            const result = statsService.countAbsencesByStudent(studentId);
            console.log(`  Total : ${result.total} | Justifiées : ${result.justifiees} | Non justifiées : ${result.non_justifiees}`);
            break;
        }
        case '4': {
            const rankings = statsService.getRankings();
            printRows('classement', rankings);
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}

export { menuStats };