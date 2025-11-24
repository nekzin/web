import { NextResponse } from 'next/server';
import { dbInit } from '@/db/AppDataSource';
import { getGroupsDb } from '@/db/groupDb';

export async function GET() {
  try {
    // Инициализируем базу данных
    await dbInit();
    
    const groups = await getGroupsDb();
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error in GET /api/groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}