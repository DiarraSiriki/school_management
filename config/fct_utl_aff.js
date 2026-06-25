// ============================================================
// utils/cliUtils.js (ou outils CLI)
// ============================================================

import readline from 'readline';
import * as etudiantService from '../services/studentService.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Pose une question à l'utilisateur et attend sa réponse (Promisifié)
 */
function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

/**
 * Affiche un joli en-tête encadré pour les titres de sections
 */
function header(titre) {
    // On force le titre à s'afficher sur 40 caractères, centré ou aligné à gauche
    const texte = titre.padEnd(40, ' '); 

    console.log('\n╔════════════════════════════════════════════╗');
    console.log(`║  ${texte}  ║`);
    console.log('╚════════════════════════════════════════════╝');
}
/**
 * Ligne de séparation visuelle
 */
function separator() {
    console.log('──────────────────────────────────────────────────');
}

/**
 * Affiche un menu structuré avec son titre et ses options
 */
function showMenu(title, items) {
    header(title);
    items.forEach((line) => console.log(line));
    separator();
}

/**
 * Affiche une liste simple de choix (utilisé parfois en complément)
 */
function printMenu(menu) {
    menu.forEach((item) => console.log(item));
}

/**
 * Affiche proprement les données sous forme de tableau dans la console
 */
function printRows(label, rows) {
    if (!rows || rows.length === 0) {
        console.log(`  Aucun ${label} trouvé.`);
        return;
    }
    console.table(rows);
}

// ------------------------------------------------------------
// FONCTIONS DE VALIDATION ET RÉSOLUTION
// ------------------------------------------------------------

/**
 * Convertit et valide qu'une valeur saisie est un ID entier correct
 */
function parseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Tente de trouver l'ID d'un étudiant soit par son ID direct numérique, 
 * soit en recherchant son matricule textuel en base de données
 */
function resolveStudentId(value) {
    if (!value) return null;
    
    // 1. On teste si c'est un ID numérique direct (ex: "3")
    const directId = parseId(value);
    if (directId) return directId;
    
    // 2. Sinon, on considère que c'est un matricule (ex: "MAT-2026-XYZ")
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