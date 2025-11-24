import { NextRequest, NextResponse } from 'next/server';
import { getStudentsDb, addStudentDb } from '@/db/studentDb';
import { dbInit } from '@/db/AppDataSource';

export async function GET() {
  try {
    // Инициализируем базу данных
    await dbInit();
    
    const students = await getStudentsDb();
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error in GET /api/students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Инициализируем базу данных
    await dbInit();
    
    const student = await request.json();
    delete student.id; // Удаляем id, если он был передан
    
    const newStudent = await addStudentDb(student);
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/students:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}