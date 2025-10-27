// src/components/Students/Students.tsx
'use client';

import { useEffect, useState } from 'react';
import useStudents from '@/hooks/useStudents';
import type StudentInterface from '@/types/StudentInterface';
import styles from './Students.module.scss';
import Student from './Student/Student';
import { AddStudent } from './AddStudent';

interface Group {
  id: number;
  name: string;
}

const Students = (): React.ReactElement => {
  const { students, deleteStudentMutate, createStudentMutate, isCreating } = useStudents();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}groups`);
        if (res.ok) {
          const data = await res.json();
          setGroups(data);
        }
      } catch (err) {
        console.error('Не удалось загрузить группы', err);
      }
    };
    fetchGroups();
  }, []);

  const onDeleteHandler = (studentId: number): void => {
    if (confirm('Удалить студента?')) {
      debugger;
      console.log('OnDeleteHandler', studentId);
      deleteStudentMutate(studentId);
    }
  };

  const onAddHandler = (data: {
    firstName: string;
    lastName: string;
    middleName: string;
    groupId: number;
  }) => {
    debugger;
    console.log('Добавление студента',data);
    createStudentMutate(data);
  };

  return (
    <div className={styles.Students}>
      <AddStudent
        onAdd={onAddHandler}
        isPending={isCreating}
        groups={groups}
      />

      {students.map((student: StudentInterface) => (
        <Student
          key={student.id}
          student={student}
          onDelete={onDeleteHandler}
        />
      ))}
    </div>
  );
};

export default Students;
