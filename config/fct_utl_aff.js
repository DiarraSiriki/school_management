

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
    const largeurInterieure = 60; 
    const texte = titre.padEnd(largeurInterieure - 2, ' ');
    const ligneHaut = '╔' + '═'.repeat(largeurInterieure) + '╗';
    const ligneBas = '╚' + '═'.repeat(largeurInterieure) + '╝';

    console.log(`\n${ligneHaut}`);
    console.log(`║ ${texte} ║`);
    console.log(ligneBas);
}
function separator() {
    console.log('──────────────────────────────────────────────────');
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