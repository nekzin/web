
import { NextRequest, NextResponse } from 'next/server';
import { getStudentsDb } from '@/db/studentDb';
import { createStudentDb } from '@/db/studentDb'; // ← предполагаем, что вы создадите эту функцию

export async function GET(): Promise<Response> {
  try {
    const students = await getStudentsDb();
    return NextResponse.json(students);
  } catch (error) {
    console.error('Ошибка получения студентов:', error);
    return NextResponse.json({ error: 'Не удалось загрузить студентов' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, middleName, groupId } = body;

    if (!lastName || !firstName || groupId === undefined) {
      return NextResponse.json({ error: 'Требуются: lastName, firstName, groupId' }, { status: 400 });
    }

    const newStudent = await createStudentDb({
      firstName,
      lastName,
      middleName,
      groupId,
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Ошибка:', error);
    return NextResponse.json({ error: 'Не удалось создать студента' }, { status: 500 });
  }
}