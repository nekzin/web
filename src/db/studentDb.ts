import sqlite3 from 'sqlite3';
import { Student } from './entity/Student.entity';
import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';
import FioInterface from '@/types/FioInterface';
import AppDataSource from './AppDataSource';

//const studentRepository = AppDataSource.getRepository(Student);

/**
 * Получение студентов
 * @returns Promise<StudentInterface[]>
 */

const getStudentRepo = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource.getRepository(Student);
};

export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  const repo = await getStudentRepo();
  return await repo.find();
};

export const deleteStudentDb = async (studentId: number): Promise<number> => {
  const repo = await getStudentRepo();
  await repo.delete(studentId);
  return studentId;
};

export const addStudentDb = async (
  studentFields: Omit<StudentInterface, 'id'>
): Promise<StudentInterface> => {
  const repo = await getStudentRepo();
  const student = repo.create(studentFields);
  return await repo.save(student);
};

export const addRandomStudentsDb = async (amount: number = 10): Promise<StudentInterface[]> => {
  const students: StudentInterface[] = [];
  for (let i = 0; i < amount; i++) {
    const fio = getRandomFio();
    const newStudent = await addStudentDb({
      ...fio,
      groupId: 1,
    });
    students.push(newStudent);
  }
  return students;
};
export const createStudentDb = async (data: {
  firstName: string;
  lastName: string;
  middleName: string;
  groupId: number;
}): Promise<StudentInterface> => {
  const db = new sqlite3.Database(process.env.DB ?? './db/vki-web.db');

  const { firstName, lastName, middleName, groupId } = data;

  const newStudent = await new Promise<StudentInterface>((resolve, reject) => {
    const sql = `
      INSERT INTO student (firstName, lastName, middleName, groupId)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [firstName, lastName, middleName, groupId], function (err) {
      if (err) {
        reject(err);
        db.close();
        return;
      }

      const newStudent: StudentInterface = {
        id: this.lastID,
        firstName,
        lastName,
        middleName: middleName, 
        groupId,
      };

      resolve(newStudent);
      db.close();
    });
  });

  return newStudent;
};