
// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9b : MENU ÉTUDIANTS - Gestion des étudiants
// ═══════════════════════════════════════════════════════════════════════════════

import * as etudiantService from '../../services/studentService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import {
    ask,
    showMenu,
    printRows,
    resolveStudentId
} from '../../utils/fct_utl_aff.js';

async function menuEtudiants() {
    showMenu(MENU_TITLES.students, MENUS.students);

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const matricule = await ask(PROMPTS.matricule);
            const nom = await ask(PROMPTS.name);
            const prenom = await ask(PROMPTS.firstName);
            const age = await ask(PROMPTS.age);
            const classe = await ask(PROMPTS.classe);
            const id = etudiantService.addStudent(matricule.trim(), nom.trim(), prenom.trim(), parseInt(age, 10), classe.trim());
            console.log(`  Étudiant créé avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const students = etudiantService.listStudents();
            printRows('étudiant', students);
            const studentInput = await ask(PROMPTS.studentIdOrMatricule);
            const id = resolveStudentId(studentInput.trim());
            if (!id) {
                console.log(MESSAGES.studentNotFound);
                break;
            }
            const matricule = await ask(PROMPTS.matricule);
            const nom = await ask(PROMPTS.name);
            const prenom = await ask(PROMPTS.firstName);
            const age = await ask(PROMPTS.age);
            const classe = await ask(PROMPTS.classe);
            const ok = etudiantService.updateStudent(id, matricule.trim(), nom.trim(), prenom.trim(), parseInt(age, 10), classe.trim());
            console.log(ok ? '  Étudiant modifié.' : '  Modification échouée.');
            break;
        }
        case '3': {
            const students = etudiantService.listStudents();
            printRows('étudiant', students);
            const studentInput = await ask(PROMPTS.studentIdOrMatriculeToDelete);
            const id = resolveStudentId(studentInput.trim());
            if (!id) {
                console.log(MESSAGES.studentNotFound);
                break;
            }
            const ok = etudiantService.removeStudent(id);
            console.log(ok ? '  Étudiant supprimé.' : '  Suppression échouée.');
            break;
        }
        case '4': {
            const terme = await ask(PROMPTS.searchTerm);
            const results = etudiantService.searchStudent(terme.trim());
            printRows('étudiant', results);
            break;
        }
        case '5': {
            const students = etudiantService.listStudents();
            printRows('étudiant', students);
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}

export { menuEtudiants };