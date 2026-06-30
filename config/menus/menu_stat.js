import * as statsService from '../../services/statisService.js'; 
import * as noteService from '../../services/gradeService.js'; 
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask, showMenu, printRows, resolveStudentId, header } from '../fct_utl_aff.js';
import { getCurrentUser } from '../Authen.js';

async function menuStats() {
    const user = getCurrentUser();

    if (user && (user.role === 'student' || user.role === 'etudiant')) {
        header("MA MOYENNE GLOBALE");
        
        const moyenne = noteService.calculateAverage(user.student_id);
        
        if (moyenne !== null && !Number.isNaN(moyenne)) {
            console.log(`\n  Votre Moyenne Actuelle : ${moyenne.toFixed(2)} / 20`);
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
            
            console.log("\n  --- BILAN DE L'ÉTUDIANT ---");
            
            const moyenne = noteService.calculateAverage(studentId);
            if (moyenne !== null && !Number.isNaN(moyenne)) {
                console.log(`  Moyenne Générale : ${moyenne.toFixed(2)} / 20`);
            } else {
                console.log("  Moyenne Générale : Pas encore de notes enregistrées.");
            }
            
            const resultAbsences = statsService.countAbsencesByStudent(studentId);
            console.log(`  Absences Totales : ${resultAbsences.total} (Justifiées : ${resultAbsences.justifiees} | Non justifiées : ${resultAbsences.non_justifiees})`);
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