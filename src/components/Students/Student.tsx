import type StudentInterface from '@/types/StudentInterface';
import { BackButton } from '@/components/BackButton';

interface StudentProps {
  student: StudentInterface;
}

export const Student = ({ student }: StudentProps) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <BackButton href="/students" label="<< список студентов" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {student.firstName} {student.lastName}
        </h1>
        <p className="text-gray-600">ID студента: {student.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold text-gray-700 mb-1">Имя:</h2>
          <p className="text-gray-900">{student.firstName}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-700 mb-1">Фамилия:</h2>
          <p className="text-gray-900">{student.lastName}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-700 mb-1">Возраст:</h2>
          <p className="text-gray-900">{student.middleName}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-700 mb-1">Группа:</h2>
          <p className="text-gray-900">{student.group?.name || 'Не указана'}</p>
        </div>
      </div>
    </div>
  );
};