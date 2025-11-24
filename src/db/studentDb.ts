import { Student } from './entity/Student.entity';
import type StudentInterface from '@/types/StudentInterface';
import getRandomFio from '@/utils/getRandomFio';
import AppDataSource from './AppDataSource';

/**
 * Получение студентов
 * @returns Promise<StudentInterface[]>
 */
export const getStudentsDb = async (): Promise<StudentInterface[]> => {
  // Инициализируем источник данных, если он еще не инициализирован
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  const studentRepository = AppDataSource.getRepository(Student);
  const students = await studentRepository.find({ relations: ['group'] });
  return students as StudentInterface[];
};

/**
 * Получения студента по id
 * @param id id студента
 * @returns Promise<Student | null>
 */
export const getStudentByIdDb = async (id: number): Promise<Student | null> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  const studentRepository = AppDataSource.getRepository(Student);
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
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  const studentRepository = AppDataSource.getRepository(Student);
  await studentRepository.delete(studentId);
  return studentId;
};

/**
 * Добавление студента
 * @param studentField поля студента
 * @returns Promise<StudentInterface>
 */
export const addStudentDb = async (studentFields: Omit<StudentInterface, 'id'>): Promise<StudentInterface> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  const studentRepository = AppDataSource.getRepository(Student);
  const student = new Student();
  const newStudent = await studentRepository.save({
    ...student,
    ...studentFields,
  });
  return newStudent;
};

/**
 * Добавление рандомных студента
 * @param amount количество рандомных записей
 * @returns Promise<StudentInterface[]>
 */
export const addRandomStudentsDb = async (amount: number = 10): Promise<StudentInterface[]> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  
  const students: StudentInterface[] = [];
  const studentRepository = AppDataSource.getRepository(Student);

  for (let i = 0; i < amount; i++) {
    const fio = getRandomFio();

    const newStudent = await studentRepository.save({
      ...fio,
      contacts: 'contact',
      groupId: Math.floor(Math.random() * 4) + 1,
    });
    students.push(newStudent as StudentInterface);
  }

  return students;
};