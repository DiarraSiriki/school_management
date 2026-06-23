import * as etudiantService from '../../services/studentService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from '../constents.js';
import { ask, showMenu, printRows, resolveStudentId } from '../../config/fct_utl_aff.js';
import { getCurrentUser, isStudentRole } from '../Authen.js';

async function menuEtudiants() {
    const user = getCurrentUser();
    
    // Si un étudiant accède à ce menu, on filtre directement ses données personnelles
    if (user && isStudentRole(user.role)) {
        header("MON PROFIL ÉTUDIANT");
        if (!user.student_id) {
            console.log("  Aucun profil physique étudiant lié à votre compte.");
            return;
        }
        const visual = etudiantService.getStudentById(user.student_id);
        printRows('étudiant', visual ? [visual] : []);
        await ask("\n  Appuyez sur Entrée pour revenir...");
        return;
    }

    showMenu(MENU_TITLES.students, MENUS.students);
    const choix = await ask(PROMPTS.choice);
    
    switch (choix.trim()) {
        case '1': {
            const matricule = await ask(PROMPTS.matricule);
            const nom = await ask(PROMPTS.name);
            const prenom = await ask(PROMPTS.firstName);
            const age = await ask(PROMPTS.age);
            const classe = await ask(PROMPTS.classe);
            const password = await ask(PROMPTS.password);
            const id = etudiantService.addStudent(matricule.trim(), nom.trim(), prenom.trim(), parseInt(age, 10), classe.trim(), password.trim());
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
            const email = await ask(PROMPTS.email);
            const password = await ask(PROMPTS.password);
            const ok = etudiantService.updateStudent(id, matricule.trim(), nom.trim(), prenom.trim(), parseInt(age, 10), classe.trim(), email.trim(), password.trim());
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