# Système de Gestion d'École (CLI)

##  Description du Projet
Application complète en ligne de commande (CLI) pour la gestion scolaire. Développée en JavaScript (Node.js) sans framework, elle permet de gérer les utilisateurs, étudiants, professeurs, matières, notes, absences et de générer des statistiques globales.

L'accent est mis sur une architecture logicielle propre, l'utilisation de Git, une base de données relationnelle locale et un système de journalisation (logging).



##  Fonctionnalités Principales

### Gestion des Utilisateurs
- Création de comptes administratifs
- Authentification par email et mot de passe
- Gestion des rôles (admin, teacher, student)

### Gestion des Étudiants
- Ajout, modification, suppression d'étudiants
- Recherche par matricule, nom ou classe
- Création automatique du compte utilisateur associé

### Gestion des Professeurs
- Ajout, modification, suppression de professeurs
- Assignation de matière principale
- Création automatique du compte utilisateur associé

### Gestion des Matières
- Création et modification de matières
- Assignation à des classes et professeurs
- Consultation des matières par classe

### Gestion des Notes
- Ajout, modification, suppression de notes
- Calcul des moyennes par étudiant
- Consultation des notes par étudiant

### Gestion des Absences
- Enregistrement des absences
- Modification du statut (justifiée/non justifiée)
- Historique des absences par étudiant

### Statistiques
- Calcul de la moyenne générale de l'établissement
- Classement des étudiants
- Profil statistique d'un étudiant (moyenne & absences)
- Identification du meilleur étudiant (major)



##  Technologies Utilisées

- **Langage :** JavaScript / Node.js
- **Base de données :** SQLite via le package `better-sqlite3`
- **Interface :** Ligne de commande (CLI)
- **Gestionnaire de version :** Git
- **Modules natifs :** `readline`, `path`, `url`


##  Structure du Projet

``text
school-management/
├── main.js                      # Point d'entrée de l'application
├── package.json                # Dépendances du projet
├── db/
│   ├── database.js             # Configuration et initialisation SQLite
│   └── database.db             # Fichier de base de données
├── models/                     # Classes d'objets (POO)
│   ├── modelUsers.js           # Modèle User
│   ├── modelStudent.js         # Modèle Student
│   ├── teacher_models.js       # Modèle Teacher
│   ├── model_Subjects.js       # Modèle Subject
│   ├── modelGrade.js           # Modèle Grade
│   └── modelAbsences.js        # Modèle Absence
├── services/                   # Logique métier (CRUD)
│   ├── userService.js          # Service utilisateurs
│   ├── studentService.js       # Service étudiants
│   ├── teacherService.js       # Service professeurs
│   ├── matiereServive.js       # Service matières
│   ├── gradeService.js         # Service notes
│   ├── absenceService.js       # Service absences
│   └── statisService.js        # Service statistiques
├── config/                     # Configuration
│   ├── Authen.js               # Gestion de l'authentification
│   ├── constents.js            # Constantes (menus, messages,prompts)
│   ├── fct_utl_aff.js          # Fonctions utilitaires d'affichage
│   └── menus/                  # Menus de l'application
│       ├── Menu_principal.js   # Menu principal
│       ├── menu_user.js        # Menu utilisateurs
│       ├── menu_etudi.js       # Menu étudiants
│       ├── menu_prof.js        # Menu professeurs
│       ├── menu_matieres.js    # Menu matières
│       ├── menu_notes.js       # Menu notes
│       ├── menu_absen.js       # Menu absences
│       └── menu_stat.js        # Menu statistiques
├── utils/
│   └── logger.js               # Système de journalisation
└── logs/                       # Répertoire des logs
``



##  Installation

1. Cloner le dépôt :

git clone <url-du-dépôt>
cd school_management


2. Installer les dépendances :

npm install



##  Utilisation

Lancer l'application :

node main.js


### Rôles et Accès

- **Admin :** Accès complet à toutes les fonctionnalités
- **Professeur :** Gestion des notes, consultation des étudiants et matières
- **Étudiant :** Consultation de ses notes, absences et moyenne



##  Base de Données

L'application utilise SQLite avec les tables suivantes :
- `users` : Comptes utilisateurs globaux
- `students` : Informations des étudiants
- `teachers` : Informations des professeurs
- `subjects` : Matières
- `grades` : Notes des étudiants
- `absences` : Absences des étudiants