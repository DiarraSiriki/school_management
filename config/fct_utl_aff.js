
// 
// ÉTAPE 2 : INITIALISATION - Configuration de readline pour les entrées utilisateur
// 
import readline from 'readline';
import * as etudiantService from '../services/studentService.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


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


// FONCTIONS DE VALIDATION - Traitement des IDs et données

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



export {
    ask,
    header,
    separator,
    showMenu,
    printMenu,
    printRows,
    parseId,
    resolveStudentId,
    rl
};
