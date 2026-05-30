const firebaseConfig = {
    apiKey: "AIzaSyDx76_mQHM7EJCLhRA0sUpPj9Y0WqXNIeU",
    authDomain: "server-70049.firebaseapp.com",
    databaseURL: "https://server-70049-default-rtdb.firebaseio.com",
    projectId: "server-70049",
    storageBucket: "server-70049.firebasestorage.app",
    messagingSenderId: "184269338772",
    appId: "1:184269338772:web:e1182d8462dd8176501c81"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

async function initializeTestUsers() {
    const testUsers = [
        { name: "TL-TEST.project 1", email: "test1", password: "test123", role: "student" },
        { name: "TL-TEST.project 2", email: "test2", password: "test123", role: "student" },
        { name: "TL-TEST.project 3", email: "test3", password: "test123", role: "student" },
        { name: "TL-TEST.project 4", email: "test4", password: "test123", role: "student" },
        { name: "TL-TEST.project 5", email: "test5", password: "test123", role: "student" },
        { name: "TL-TEST.project 6", email: "test6", password: "test123", role: "student" },
        { name: "TL-TEST.project 7", email: "test7", password: "test123", role: "student" },
        { name: "TL-TEST.project 8", email: "test8", password: "test123", role: "student" },
        { name: "TL-TEST.project 9", email: "test9", password: "test123", role: "student" },
        { name: "TL-TEST.project 10", email: "test10", password: "test123", role: "student" },
        { name: "TL-TEST.project 11", email: "test11", password: "test123", role: "student" },
        { name: "TL-TEST.project 12", email: "test12", password: "test123", role: "student" },
        { name: "TL-TEST.project 13", email: "test13", password: "test123", role: "student" },
        { name: "TL-TEST.project 14", email: "test14", password: "test123", role: "student" },
        { name: "TL-TEST.project 15", email: "test15", password: "test123", role: "student" },
        { name: "TL-TEST.project 16", email: "test16", password: "test123", role: "student" },
        { name: "TL-TEST.project 17", email: "test17", password: "test123", role: "student" },
        { name: "TL-TEST.project 18", email: "test18", password: "test123", role: "student" },
        { name: "TL-TEST.project 19", email: "test19", password: "test123", role: "student" },
        { name: "TL-TEST.project 20", email: "test20", password: "test123", role: "student" },
        { name: "Администратор", email: "admin", password: "admin123", role: "admin" }
    ];

    const usersRef = db.ref('tl-schedules/users');
    usersRef.once('value', snapshot => {
        if (!snapshot.exists()) {
            const updates = {};
            testUsers.forEach((user, index) => {
                const userKey = 'user_' + (index + 1);
                updates[`tl-schedules/users/${userKey}`] = {
                    name: user.name,
                    email: user.email,
                    username: user.email,
                    password: user.password,
                    role: user.role,
                    createdAt: new Date().toISOString()
                };
            });

            db.ref().update(updates).then(() => {
                console.log('✅ Тестовые пользователи созданы успешно!');
                initializeTodayAttendance();
            }).catch(error => {
                console.error('❌ Ошибка создания пользователей:', error);
            });
        } else {
            console.log('ℹ️ Пользователи уже существуют');
            initializeTodayAttendance();
        }
    });
}

function initializeTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const attendancePath = `tl-schedules/attendance/${today}`;

    db.ref(attendancePath).once('value', snapshot => {
        if (!snapshot.exists()) {
            const attendanceUpdates = {};
            const usersRef = db.ref('tl-schedules/users');
            
            usersRef.once('value', usersSnapshot => {
                usersSnapshot.forEach(child => {
                    const user = child.val();
                    attendanceUpdates[`${attendancePath}/${child.key}`] = {
                        userId: child.key,
                        name: user.name,
                        role: user.role,
                        status: 'present',
                        createdAt: new Date().toISOString()
                    };
                });

                db.ref().update(attendanceUpdates).then(() => {
                    console.log('✅ Посещаемость на сегодня инициализирована!');
                }).catch(error => {
                    console.error('❌ Ошибка инициализации посещаемости:', error);
                });
            });
        }
    });
}

window.addEventListener('load', initializeTestUsers);