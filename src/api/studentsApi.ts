import type StudentInterface from '@/types/StudentInterface';

export const getStudentsApi = async (): Promise<StudentInterface[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}students`);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    const students = await response.json() as StudentInterface[];
    return students;
  }
  catch (err) {
    console.log('>>> getGroupsApi', err);
    return [] as StudentInterface[];
  }
};

export const deleteStudentApi = async (studentId: number): Promise<number> => {
  console.log('deleteStudentApi', studentId);
  debugger;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}students/${studentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}${response.statusText}`);
    }
    console.log('deleteStudentApi ok', studentId);
    debugger;
    return studentId;
  }
  catch (err) {
    console.log('>>> deleteStudentApi', err);
    return -1;
  }
};
export const createStudentApi = async (studentData: {
  firstName: string;
  lastName: string;
  middleName: string; 
  groupId: number;
}): Promise<StudentInterface> => {
  const payload = {
    firstName: studentData.firstName,
    lastName: studentData.lastName,
    middleName: studentData.middleName,
    groupId: studentData.groupId,
  };

  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка создания студента');
  }

  return response.json() as Promise<StudentInterface>;
};