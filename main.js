
// 
// IMPORTS - Chargement des dépendances et modules
// 

import './db/database.js';
import logger from './utils/logger.js';

import { login } from './config/Authen.js';

import {Menu_principal} from './config/menus/Menu_principal.js';



// 
// BOUCLE PRINCIPALE - Gestion du flux de l'application
// 

async function menuPrincipal() {
    while (true) {
        try {
            await Menu_principal();
        } catch (err) {
            logger.error(`Erreur : ${err.message}`);
            console.error('  Erreur :', err.message);
        }
    }
}



//
// POINT D'ENTRÉE - Démarrage de l'application
//


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
