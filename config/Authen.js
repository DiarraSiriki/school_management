export const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'professeur',
    STUDENT: 'etudiant'
};

export const MENU_BY_ROLE = {
    [ROLES.ADMIN]: [
        '  1. Utilisateurs',
        '  2. Étudiants',
        '  3. Professeurs',
        '  4. Matières',
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ],
    [ROLES.TEACHER]: [
        '  2. Étudiants',
        '  4. Matières',
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ],
    [ROLES.STUDENT]: [
        '  5. Notes',
        '  6. Absences',
        '  7. Statistiques',
        '  9. Se déconnecter',
        '  0. Quitter'
    ]
};

export function normalizeRole(role) {
    if (!role || typeof role !== 'string') return '';
    const value = role.trim().toLowerCase();
    if (value === 'admin') return ROLES.ADMIN;
    if (value === 'professeur' || value === 'prof') return ROLES.TEACHER;
    if (value === 'etudiant' || value === 'étudiant' || value === 'student') return ROLES.STUDENT;
    return value;
}

export function isAdminRole(role) {
    return normalizeRole(role) === ROLES.ADMIN;
}

export function isTeacherRole(role) {
    return normalizeRole(role) === ROLES.TEACHER;
}

export function isStudentRole(role) {
    return normalizeRole(role) === ROLES.STUDENT;
}

export function getMenuForRole(role) {
    const normalized = normalizeRole(role);
    return MENU_BY_ROLE[normalized] || ['  0. Quitter'];
}
