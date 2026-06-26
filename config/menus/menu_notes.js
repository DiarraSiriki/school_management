
import * as noteService from '../../services/gradeService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask, showMenu, printRows, resolveStudentId, parseId, header, separator } from '../fct_utl_aff.js';
import { getCurrentUser } from '../Authen.js';

async function menuNotes() {
    const user = getCurrentUser();

    // Pour étudiant : voir ses notes uniquement
    if (user && (user.role === 'student' || user.role === 'etudiant')) {
        header("MES NOTES");
        const grades = noteService.getStudentGrades(user.student_id);
        if (!grades || grades.length === 0) {
            console.log(MESSAGES.noGrades);
        } else {
            printRows('note', grades);
        }
        await ask("\n  Appuyez sur Entrée pour revenir...");
        return;
    }

    // Pour professeur : menu limité (ajouter/modifier notes seulement)
    if (user && (user.role === 'teacher' || user.role === 'professeur')) {
        header("GESTION DES NOTES");
        const profMenu = [
            '  1. Ajouter une note',
            '  2. Modifier une note',
            '  3. Voir les notes d\'un étudiant',
            '  0. Retour'
        ];
        printMenu(profMenu);
        separator();
        
        const choix = await ask(PROMPTS.choice);
        switch (choix.trim()) {
            case '1': {
                const studentInput = await ask(PROMPTS.studentIdOrMatricule);
                const studentId = resolveStudentId(studentInput.trim());
                const subjectId = parseId(await ask(PROMPTS.subjectId));
                const note = parseFloat(await ask(PROMPTS.gradeValue));
                if (!studentId || !subjectId || Number.isNaN(note)) {
                    console.log(MESSAGES.invalidData);
                    break;
                }
                const id = noteService.addGrade(studentId, subjectId, note);
                console.log(`  Note ajoutée avec l'ID ${id}.`);
                break;
            }
            case '2': {
                const gradeId = parseId(await ask(PROMPTS.gradeId));
                const note = parseFloat(await ask(PROMPTS.newGrade));
                if (!gradeId || Number.isNaN(note)) {
                    console.log(MESSAGES.invalidData);
                    break;
                }
                const ok = noteService.updateGrade(gradeId, note);
                console.log(ok ? '  Note modifiée.' : '  Modification échouée.');
                break;
            }
            case '3': {
                const studentInput = await ask(PROMPTS.studentIdOrMatricule);
                const studentId = resolveStudentId(studentInput.trim());
                if (!studentId) {
                    console.log(MESSAGES.studentNotFound);
                    break;
                }
                const grades = noteService.getStudentGrades(studentId);
                if (!grades || grades.length === 0) {
                    console.log(MESSAGES.noGrades);
                    break;
                }
                printRows('note', grades);
                break;
            }
            case '0': return;
            default: console.log(MESSAGES.invalidChoice);
        }
        return;
    }

    // Pour admin : menu complet
    showMenu(MENU_TITLES.grades, MENUS.grades);
    const choix = await ask(PROMPTS.choice);
    
    switch (choix.trim()) {
        case '1': {
            const studentInput = await ask(PROMPTS.studentIdOrMatricule);
            const studentId = resolveStudentId(studentInput.trim());
            const subjectId = parseId(await ask(PROMPTS.subjectId));
            const note = parseFloat(await ask(PROMPTS.gradeValue));
            if (!studentId || !subjectId || Number.isNaN(note)) {
                console.log(MESSAGES.invalidData);
                break;
            }
            const id = noteService.addGrade(studentId, subjectId, note);
            console.log(`  Note ajoutée avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const gradeId = parseId(await ask(PROMPTS.gradeId));
            const note = parseFloat(await ask(PROMPTS.newGrade));
            if (!gradeId || Number.isNaN(note)) {
                console.log(MESSAGES.invalidData);
                break;
            }
            const ok = noteService.updateGrade(gradeId, note);
            console.log(ok ? '  Note modifiée.' : '  Modification échouée.');
            break;
        }
        case '3': {
            const gradeId = parseId(await ask(PROMPTS.gradeId));
            const ok = gradeId ? noteService.removeGrade(gradeId) : false;
            console.log(ok ? '  Note supprimée.' : '  Suppression échouée.');
            break;
        }
        case '4': {
            const studentInput = await ask(PROMPTS.studentIdOrMatricule);
            const studentId = resolveStudentId(studentInput.trim());
            if (!studentId) {
                console.log(MESSAGES.studentNotFound);
                break;
            }
            const moyenne = noteService.calculateAverage(studentId);
            if (moyenne !== null && !Number.isNaN(moyenne)) {
                console.log(`  Moyenne de l'étudiant : ${moyenne.toFixed(2)} / 20`);
            } else {
                console.log("  Aucune note enregistrée pour cet étudiant.");
            }
            break;
        }
        case '5': {
            const studentInput = await ask(PROMPTS.studentIdOrMatricule);
            const studentId = resolveStudentId(studentInput.trim());
            if (!studentId) {
                console.log(MESSAGES.studentNotFound);
                break;
            }
            const grades = noteService.getStudentGrades(studentId);
            if (!grades || grades.length === 0) {
                console.log(MESSAGES.noGrades);
                break;
            }
            printRows('note', grades);
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}

export { menuNotes };