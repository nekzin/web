import { Student } from './entity/Student.entity';
import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';
import AppDataSource from './AppDataSource';

const studentRepository = AppDataSource.getRepository(Student);

/**
 * Получение студентов
 * @returns Promise<StudentInterface[]>
 */
export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  const students = await studentRepository.find({ relations: ['group'] });
  return students as StudentInterface[];
};

/**
 * Получения студента по id
 * @param id id студента
 * @returns Promise<Student | null>
 */
export const getStudentByIdDb = async (id: number): Promise<Student | null> => {
  return await studentRepository.findOne({
    where: { id },
    relations: ['group'],
  });
};

/**
 * Удаления студента
 * @param studentId ИД удаляемого студента
 * @returns Promise<number>
 */
export const deleteStudentDb = async (studentId: number): Promise<number> => {
  await studentRepository.delete(studentId);
  return studentId;
};

/**
 * Добавление студента
 * @param studentField поля студента
 * @returns Promise<StudentInterface>
 */
export const addStudentDb = async (studentFields: Omit<StudentInterface, 'id'>): Promise<StudentInterface> => {
  const student = new Student();
  const newStudent = await studentRepository.save({
    ...student,
    ...studentFields,
  });
  return newStudent;

  // return getStudentById(newStudent.id);
};

/**
 * Добавление рандомных студента
 * @param amount количество рандомных записей
 * @returns Promise<StudentInterface>
 */
export const addRandomStudentsDb = async (amount: number = 10): Promise<StudentInterface[]> => {
  const students: StudentInterface[] = [];

  for (let i = 0; i < amount; i++) {
    const fio = getRandomFio();

    const newStudent = await addStudentDb({
      ...fio,
      contacts: 'contact',
      groupId: Math.floor(Math.random() * 4) + 1,
    });
    students.push(newStudent);

    console.log(newStudent);
  }

  return students;
};
