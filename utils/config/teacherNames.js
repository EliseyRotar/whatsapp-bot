import fs from 'fs';
import path from 'path';

const dataDir = './data';
const teachersFile = path.join(dataDir, 'teachers.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load teacher names
function loadTeachers() {
    try {
        if (fs.existsSync(teachersFile)) {
            const data = fs.readFileSync(teachersFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[TEACHERS] Error loading teachers:', error.message);
    }
    return {};
}

// Save teacher names
function saveTeachers(teachers) {
    try {
        fs.writeFileSync(teachersFile, JSON.stringify(teachers, null, 2));
    } catch (error) {
        console.error('[TEACHERS] Error saving teachers:', error.message);
    }
}

// Get teacher full name
export function getTeacherFullName(surname) {
    const teachers = loadTeachers();
    return teachers[surname] || surname;
}

// Add or update teacher
export function setTeacherName(surname, fullName) {
    const teachers = loadTeachers();
    teachers[surname] = fullName;
    saveTeachers(teachers);
}

// Remove teacher
export function removeTeacherName(surname) {
    const teachers = loadTeachers();
    delete teachers[surname];
    saveTeachers(teachers);
}

// Get all teachers
export function getAllTeachers() {
    return loadTeachers();
}
