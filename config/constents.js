
export const MENU_TITLES = {
    main: "SYSTÈME DE GESTION D'ÉCOLE",
    users: 'GESTION DES UTILISATEURS',
    students: 'GESTION DES ÉTUDIANTS',
    teachers: 'GESTION DES PROFESSEURS',
    subjects: 'GESTION DES MATIÈRES',
    grades: 'GESTION DES NOTES',
    absences: 'GESTION DES ABSENCES',
    stats: 'GESTION DES STATISTIQUES'
};

export const MENUS = {
    main: [
        '  1. Utilisateurs',
        '  2. Étudiants',
        '  3. Professeurs',
        '  4. Matières',
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  0. Quitter'
    ],
    users: [
        '  1. Ajouter un utilisateur ',
        '  2. Supprimer un utilisateur',
        '  3. Lister les utilisateurs',
        '  0. Retour'
    ],
    students: [
        '  1. Ajouter un étudiant (Crée aussi son compte)',
        '  2. Modifier un étudiant',
        '  3. Supprimer un étudiant',
        '  4. Rechercher un étudiant',
        '  5. Lister tous les étudiants',
        '  0. Retour'
    ],
    teachers: [
        '  1. Ajouter un professeur (Crée aussi son compte)',
        '  2. Modifier un professeur',
        '  3. Supprimer un professeur',
        '  4. Rechercher un professeur',
        '  5. Lister les professeurs',
        '  0. Retour'
    ],
    subjects: [
        '  1. Ajouter une matière',
        '  2. Modifier une matière (Assignation prof/classe)',
        '  3. Lister les matières',
        '  0. Retour'
    ],
    grades: [
        '  1. Ajouter une note',
        '  2. Modifier une note',
        '  3. Supprimer une note',
        '  4. Calculer la moyenne d\'un étudiant',
        '  5. Voir les notes d\'un étudiant',
        '  0. Retour'
    ],
    absences: [
        '  1. Enregistrer une absence',
        '  2. Modifier le statut d\'une absence',
        '  3. Historique des absences d\'un étudiant',
        '  0. Retour'
    ],
    stats: [
        '  1. Meilleur étudiant (Major)',
        '  2. Moyenne générale de l\'établissement',
        '  3. Profil statistique d\'un étudiant (Moyenne & Absences)',
        '  4. Classement général des élèves',
        '  0. Retour'
    ]
};

export const PROMPTS = {
    choice: '  Veuillez faire votre choix : ',
    loginEmail: '  Email de connexion : ',
    loginPassword: '  Mot de passe de connexion : ',
    name: '  Nom: ',
    role: '  Rôle (admin / teacher / student) : ',
    email: '  Email : ',
    password: '  Mot de passe : ',
    userDeleteId: '  ID de l\'utilisateur à supprimer : ',
    matricule: '  Matricule : ',
    firstName: '  Prénom : ',
    age: '  Âge : ',
    classe: '  Classe (ex: 2nde A, Master 1) : ',
    studentIdOrMatricule: '  ID ou matricule de l\'étudiant : ',
    studentIdOrMatriculeToDelete: '  ID ou matricule à supprimer : ',
    searchTerm: '  Recherche (matricule, nom ou classe) : ',
    teacherSubject: '  Matière principale enseignée : ',
    teacherId: '  ID du professeur : ',
    subjectId: '  ID de la matière : ',
    gradeId: '  ID de la note : ',
    newGrade: '  Nouvelle note (0-20) : ',
    absenceDate: '  Date (DD-MM-YYYY) : ',
    absenceStatus: '  Statut (justifiée / non justifiée) : ',
    absenceId: '  ID de l\'absence : ',
    newAbsenceStatus: '  Nouveau statut (justifiée / non justifiée) : ',
    subjectName: '  Nom de la matière : ',
    teacherIdOptional: '  ID du professeur assigné (Optionnel, Entrée pour sauter) : ',
    gradeValue: '  Note (0-20) : '
};

export const MESSAGES = {
    invalidChoice: '  Choix invalide.\n',
    invalidCredentials: '  Email ou mot de passe incorrect.\n',
    accessDenied: '  Accès refusé pour ce rôle.\n',
    userDeleted: '  Utilisateur supprimé avec succès.',
    userNotFound: '  Utilisateur introuvable.',
    studentNotFound: '  Étudiant introuvable.',
    teacherNotFound: '  Professeur introuvable.',
    subjectNotFound: '  Matière introuvable.',
    invalidId: '  ID invalide.',
    invalidData: '  Données invalides.',
    modified: '  Opération de modification échouée.',
    deleted: '  Opération de suppression échouée.',
    statusModified: '  Statut mis à jour avec succès.',
    noGrades: '  Aucun enregistrement de note pour cet étudiant.',
    noStudent: '  Aucun étudiant trouvé.',
    appStarted: 'Application démarrée',
    appClosed: 'Application fermée',
    goodbye: '\n  Au revoir.\n',
    fatalError: 'Erreur fatale :'
};