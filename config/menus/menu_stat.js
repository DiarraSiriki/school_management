
import * as statsService from '../../services/statisService.js'; 
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask, showMenu, printRows, resolveStudentId, header } from '../fct_utl_aff.js';
import { getCurrentUser } from '../Authen.js';

async function menuStats() {
    const user = getCurrentUser();

    if (user && (user.role === 'student' || user.role === 'etudiant')) {
        header("MA MOYENNE GLOBALE");
        const rankings = statsService.getRankings();
        const monProfil = rankings.find(s => s.id === user.student_id);
        if (monProfil) {
            console.log(`\n  Votre Moyenne Actuelle : ${monProfil.moyenne} / 20`);
        } else {
            console.log("  Calcul impossible (aucune note enregistrée).");
        }
        await ask("\n  Appuyez sur Entrée pour revenir...");
        return;
    }

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
            console.log(`  Moyenne générale de l'établissement : ${average} / 20`);
            break;
        }
        case '3': {
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