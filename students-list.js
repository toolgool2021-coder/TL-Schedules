/**
 * СПИСОК УЧЕНИКОВ
 * 
 * Легко добавлять, удалять и редактировать учеников
 * Формат: ИМЯ В СИСТЕМЕ (будет использоваться при входе)
 * 
 * ПРИМЕР ДОБАВЛЕНИЯ:
 * const STUDENTS = [
 *     'test.project1',
 *     'test.project2',
 *     'Иван Петров',    // Можно писать и на русском
 *     'новый_ученик'
 * ];
 */

const STUDENTS = [
    'test.project1',
    'test.project2',
    'test.project3',
    'test.project4',
    'test.project5',
    'test.project6',
    'test.project7',
    'test.project8',
    'test.project9',
    'test.project10',
    'test.project11',
    'test.project12',
    'test.project13',
    'test.project14',
    'test.project15',
    'test.project16',
    'test.project17',
    'test.project18',
    'test.project19',
    'test.project20'
];

/**
 * Получить список всех учеников
 * @returns {Array}
 */
function getStudentsList() {
    return STUDENTS;
}

/**
 * Проверить есть ли ученик в списке
 * @param {string} studentName
 * @returns {boolean}
 */
function isStudent(studentName) {
    return STUDENTS.includes(studentName);
}

/**
 * Получить количество учеников
 * @returns {number}
 */
function getTotalStudents() {
    return STUDENTS.length;
}
