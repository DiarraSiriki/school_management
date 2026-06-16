
// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 1 : IMPORTS - Chargement des dépendances et modules
// ═══════════════════════════════════════════════════════════════════════════════

import './db/database.js';
import logger from './logs/loger.js';
import * as userService from './services/userService.js';
import * as etudiantService from './services/studentService.js';
import * as professeurService from './services/teacherService.js';
import * as matiereService from './services/matiereServive.js';
import * as noteService from './services/gradeService.js';
import * as absenceService from './services/absenceService.js';
import * as statsService from './services/statisService.js';
import { MENU_TITLES, MENUS, PROMPTS, MESSAGES } from './config/constents.js';
import { normalizeRole, getMenuForRole, isAdminRole, isTeacherRole, isStudentRole } from './config/Authen.js';
import readline from 'readline';


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 2 : INITIALISATION - Configuration de readline pour les entrées utilisateur
// ═══════════════════════════════════════════════════════════════════════════════

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 3 : FONCTIONS UTILITAIRES - Affichage et interactivité
// ═══════════════════════════════════════════════════════════════════════════════

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

function header(titre) {
    console.log('\n╔' + '═'.repeat(titre.length + 4) + '╗');
    console.log('║  ' + titre + '  ║');
    console.log('╚' + '═'.repeat(titre.length + 4) + '╝');
}

function separator() {
    console.log('─'.repeat(50));
}

function showMenu(title, items) {
    header(title);
    items.forEach((line) => console.log(line));
    separator();
}

function printMenu(menu) {
    menu.forEach((item) => console.log(item));
}

function printRows(label, rows) {
    if (!rows || rows.length === 0) {
        console.log(`  Aucun ${label} trouvé.`);
        return;
    }
    console.table(rows);
}


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 4 : FONCTIONS DE VALIDATION - Traitement des IDs et données
// ═══════════════════════════════════════════════════════════════════════════════

function parseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function resolveStudentId(value) {
    if (!value) return null;
    const directId = parseId(value);
    if (directId) return directId;
    const student = etudiantService.findStudentByMatricule(value.trim());
    return student ? student.id : null;
}


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 5 : GESTION UTILISATEUR CONNECTÉ - Variable globale et vérifications
// ═══════════════════════════════════════════════════════════════════════════════

let currentUser = null;

function isAdmin() {
    return currentUser && isAdminRole(currentUser.role);
}

function isTeacher() {
    return currentUser && isTeacherRole(currentUser.role);
}

function isStudent() {
    return currentUser && isStudentRole(currentUser.role);
}



// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 6 : MENU PRINCIPAL - Affichage du menu selon l'utilisateur connecté
// ═══════════════════════════════════════════════════════════════════════════════

function getMainMenuForRole() {
    if (!currentUser) {
        return [
            '  1. Se connecter',
            '  0. Quitter'
        ];
    }
    return getMenuForRole(currentUser.role);
}


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 7 : AUTHENTIFICATION - Connexion de l'utilisateur
// ═══════════════════════════════════════════════════════════════════════════════

async function login() {
    while (!currentUser) {
        header('CONNEXION');
        const email = await ask(PROMPTS.loginEmail);
        const mot_de_passe = await ask(PROMPTS.loginPassword);
        const utilisateur = userService.authenticate(email.trim(), mot_de_passe.trim());
        if (utilisateur) {
            currentUser = {
                ...utilisateur,
                role: normalizeRole(utilisateur.role)
            };
            logger.info(`Connexion réussie: ${currentUser.name} (${currentUser.role})`);
            console.log(`\n  Bienvenue ${currentUser.name} (${currentUser.role})\n`);
            return;
        }
        console.log(MESSAGES.invalidCredentials);
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 8 : MENU PRINCIPAL - Gestion des choix utilisateur
// ═══════════════════════════════════════════════════════════════════════════════

async function menuPrincipal() {
    while (true) {
        if (currentUser) {
            header(`${MENU_TITLES.main} - ${currentUser.name} (${currentUser.role})`);
        } else {
            header(MENU_TITLES.main);
        }
        const menu = getMainMenuForRole();
        printMenu(menu);
        separator();

        const choix = await ask(PROMPTS.choice);

        if (!currentUser) {
            switch (choix.trim()) {
                case '1': await login(); break;
                case '0':
                    logger.info(MESSAGES.appClosed);
                    console.log(MESSAGES.goodbye);
                    rl.close();
                    process.exit(0);
                default:
                    console.log(MESSAGES.invalidChoice);
            }
            continue;
        }

        switch (choix.trim()) {
            case '1': await menuUtilisateurs(); break;
            case '2': await menuEtudiants(); break;
            case '3': await menuProfesseurs(); break;
            case '4': await menuMatieres(); break;
            case '5': await menuNotes(); break;
            case '6': await menuAbsences(); break;
            case '7': await menuStats(); break;
            case '9':
                logger.info(`Déconnexion: ${currentUser.name} (${currentUser.role})`);
                console.log('\n  Au revoir ' + currentUser.name + '!\n');
                currentUser = null;
                break;
            case '0':
                logger.info(MESSAGES.appClosed);
                console.log(MESSAGES.goodbye);
                rl.close();
                process.exit(0);
            default:
                console.log(MESSAGES.invalidChoice);
        }
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9a : MENU UTILISATEURS - Gestion des comptes utilisateur (Admin uniquement)
// ═══════════════════════════════════════════════════════════════════════════════

async function menuUtilisateurs() {
    header(MENU_TITLES.users);
    printMenu(MENUS.users);
    separator();

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const name = await ask(PROMPTS.name);
            const role = await ask(PROMPTS.role);
            const email = await ask(PROMPTS.email);
            const mot_de_passe = await ask(PROMPTS.password);
            const id = userService.addUser(name.trim(), role.trim(), email.trim(), mot_de_passe.trim());
            console.log(`  Utilisateur créé avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const users = userService.listUsers();
            printRows('utilisateur', users);
            const id = await ask(PROMPTS.userDeleteId);
            const ok = userService.removeUser(parseId(id));
            console.log(ok ? '  Utilisateur supprimé.' : '  Utilisateur introuvable.');
            break;
        }
        case '3': {
            const users = userService.listUsers();
            printRows('utilisateur', users);
            break;
        }
        case '0': return;
        default: console.log('  Choix invalide.\n');
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9b : MENU ÉTUDIANTS - Gestion des étudiants
// ═══════════════════════════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9c : MENU PROFESSEURS - Gestion des professeurs
// ═══════════════════════════════════════════════════════════════════════════════

async function menuProfesseurs() {
    showMenu(MENU_TITLES.teachers, MENUS.teachers);

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const nom = await ask(PROMPTS.name);
            const matiere = await ask(PROMPTS.teacherSubject);
            const id = professeurService.addTeacher(nom.trim(), matiere.trim());
            console.log(`  Professeur créé avec l'ID ${id}.`);
            break;
        }
        case '2': {
            const teachers = professeurService.listTeachers();
            printRows('professeur', teachers);
            const id = parseId(await ask(PROMPTS.teacherId));
            if (!id) {
                console.log(MESSAGES.invalidId);
                break;
            }
            const nom = await ask(PROMPTS.name);
            const matiere = await ask(PROMPTS.teacherSubject);
            const ok = professeurService.updateTeacher(id, nom.trim(), matiere.trim());
            console.log(ok ? '  Professeur modifié.' : '  Modification échouée.');
            break;
        }
        case '3': {
            const teachers = professeurService.listTeachers();
            printRows('professeur', teachers);
            const id = parseId(await ask(PROMPTS.userDeleteId));
            const ok = id ? professeurService.removeTeacher(id) : false;
            console.log(ok ? '  Professeur supprimé.' : '  Suppression échouée.');
            break;
        }
        case '4': {
            const terme = await ask(PROMPTS.searchTerm);
            const results = professeurService.searchTeacher(terme.trim());
            printRows('professeur', results);
            break;
        }
        case '5': {
            const teachers = professeurService.listTeachers();
            printRows('professeur', teachers);
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9d : MENU MATIÈRES - Gestion des matières et affectation
// ═══════════════════════════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9e : MENU NOTES - Gestion des notes des étudiants
// ═══════════════════════════════════════════════════════════════════════════════

async function menuNotes() {
    showMenu(MENU_TITLES.grades, MENUS.grades);

    const choix = await ask(PROMPTS.choice);
    switch (choix.trim()) {
        case '1': {
            const students = etudiantService.listStudents();
            printRows('étudiant', students);
            const subjects = matiereService.listSubjects();
            printRows('matière', subjects);
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
            const students = etudiantService.listStudents();
            printRows('étudiant', students);
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
            const moyenne = (grades.reduce((acc, g) => acc + g.note, 0) / grades.length).toFixed(2);
            printRows('note', grades);
            console.log(`  Moyenne de l'étudiant : ${moyenne}`);
            break;
        }
        case '0': return;
        default: console.log(MESSAGES.invalidChoice);
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9f : MENU ABSENCES - Enregistrement et consultation des absences
// ═══════════════════════════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 9g : MENU STATISTIQUES - Consultation des données statistiques
// ═══════════════════════════════════════════════════════════════════════════════

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


// ═══════════════════════════════════════════════════════════════════════════════
// ÉTAPE 10 : POINT D'ENTRÉE - Démarrage de l'application
// ═══════════════════════════════════════════════════════════════════════════════

(async () => {
    try {
        logger.info('Application démarrée');
        await menuPrincipal();
    } catch (err) {
        logger.error(`Erreur fatale : ${err.message}`);
        console.error('Erreur fatale :', err.message);
        process.exit(1);
    }
})();
