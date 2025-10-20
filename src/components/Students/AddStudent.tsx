// src/components/Students/AddStudent.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface AddStudentProps {
  onAdd: (data: {
    firstName: string;
    lastName: string;
    middleName: string;
    groupId: number;
  }) => void;
  isPending?: boolean;
  groups: { id: number; name: string }[];
}

export const AddStudent = ({ onAdd, isPending = false, groups }: AddStudentProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      groupId: groups.length > 0 ? groups[0].id : 0,
    },
  });
  useEffect(() => {
    if (groups.length > 0) {
      reset((prev) => ({
        ...prev,
        groupId: groups[0].id,
      }));
    }
  }, [groups, reset]);

  const onSubmit = (data: any) => {
    onAdd({
      ...data,
      groupId: Number(data.groupId),
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <h3>Добавить студента</h3>

      <div >
        <input
          {...register('lastName', { required: 'Фамилия обязательна' })}
          placeholder="Фамилия"
          disabled={isPending}
        />
        {errors.lastName && <p >{errors.lastName.message as string}</p>}
      </div>

      <div >
        <input
          {...register('firstName', { required: 'Имя обязательно' })}
          placeholder="Имя"
          disabled={isPending}
        />
        {errors.firstName && <p >{errors.firstName.message as string}</p>}
      </div>

      <div>
        <input
          {...register('middleName')}
          placeholder="Отчество"
          disabled={isPending}
        />
      </div>

      <div>
        <select
          {...register('groupId', { valueAsNumber: true, required: 'Выберите группу' })}
          disabled={isPending || groups.length === 0}
        >
          {groups.length === 0 ? (
            <option>Загрузка групп...</option>
          ) : (
            groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))
          )}
        </select>
        {errors.groupId && <p>{errors.groupId.message as string}</p>}
      </div>

      <button type="submit" disabled={isPending || groups.length === 0}>
        {isPending ? 'Добавление...' : 'Добавить'}
      </button>
    </form>
  );
};