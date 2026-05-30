/**
 * ФАЙЛ КОНФИГУРАЦИИ ПОЛЬЗОВАТЕЛЕЙ
 * Здесь задаются все учетные записи и их привилегии
 * Роли назначаются только в этом файле (при регистрации люди получают роль "student")
 */

const PREDEFINED_USERS = {
    // АДМИНИСТРАТОРЫ (привилегии администратора)
    'admin': {
        username: 'admin',
        email: 'admin@tl-schedules.local',
        password: 'admin123',
        name: 'Администратор',
        role: 'admin',
        permissions: ['view_all', 'edit_attendance', 'manage_users', 'export_data']
    },
    
    // УЧИТЕЛЯ (могут просматривать посещаемость)
    'test1': {
        username: 'test1',
        email: 'test1@tl-schedules.local',
        password: 'test123',
        name: 'Тестовый Пользователь',
        role: 'teacher',
        permissions: ['view_attendance', 'mark_attendance']
    },
    
    'tomoyeva': {
        username: 'tomoyeva',
        email: 'tomoyeva@tl-schedules.local',
        password: 'tomoyeva123',
        name: 'Томоева Гульзат',
        role: 'teacher',
        permissions: ['view_attendance', 'mark_attendance']
    },
    
    'kalybaeva': {
        username: 'kalybaeva',
        email: 'kalybaeva@tl-schedules.local',
        password: 'kalybaeva123',
        name: 'Калыбаева Кульжан',
        role: 'teacher',
        permissions: ['view_attendance', 'mark_attendance']
    },
    
    'nurumova': {
        username: 'nurumova',
        email: 'nurumova@tl-schedules.local',
        password: 'nurumova123',
        name: 'Нурумова Елена',
        role: 'teacher',
        permissions: ['view_attendance', 'mark_attendance']
    },
    
    // УЧЕНИКИ (могут отмечать себя)
    'student1': {
        username: 'student1',
        email: 'student1@tl-schedules.local',
        password: 'student123',
        name: 'Ученик 1',
        role: 'student',
        permissions: ['view_own_attendance', 'mark_own_attendance']
    },
    
    'student2': {
        username: 'student2',
        email: 'student2@tl-schedules.local',
        password: 'student123',
        name: 'Ученик 2',
        role: 'student',
        permissions: ['view_own_attendance', 'mark_own_attendance']
    }
};

/**
 * РОЛИ И ИХ ПРИВИЛЕГИИ
 * Определение прав доступа для каждой роли
 */
const ROLE_PERMISSIONS = {
    'admin': {
        description: 'Администратор системы',
        permissions: [
            'view_all',           // Просмотреть всех пользователей
            'edit_attendance',    // Редактировать посещаемость
            'manage_users',       // Управлять пользователями
            'export_data',        // Экспортировать данные
            'view_reports',       // Просмотреть отчеты
            'system_settings'     // Настройки системы
        ]
    },
    'teacher': {
        description: 'Учитель',
        permissions: [
            'view_attendance',    // Просмотреть посещаемость учеников
            'mark_attendance'     // Отметить посещаемость
        ]
    },
    'student': {
        description: 'Ученик',
        permissions: [
            'view_own_attendance',    // Просмотреть свою посещаемость
            'mark_own_attendance'     // Отметить себя при входе
        ]
    }
};

/**
 * Функция для проверки прав пользователя
 * @param {Object} user - Объект пользователя
 * @param {string} permission - Требуемое разрешение
 * @returns {boolean}
 */
function hasPermission(user, permission) {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
}

/**
 * Функция для получения пользователя из предустановленного списка
 * @param {string} username - Имя пользователя или email
 * @returns {Object|null}
 */
function getPredefinedUser(username) {
    // Проверяем по username
    if (PREDEFINED_USERS[username]) {
        return PREDEFINED_USERS[username];
    }
    
    // Проверяем по email
    for (const key in PREDEFINED_USERS) {
        if (PREDEFINED_USERS[key].email === username) {
            return PREDEFINED_USERS[key];
        }
    }
    
    return null;
}

/**
 * Функция для получения роли пользователя
 * @param {Object} user - Объект пользователя
 * @returns {string}
 */
function getUserRole(user) {
    return user ? user.role : 'guest';
}
