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

export { menuPrincipal as Menu_principal };