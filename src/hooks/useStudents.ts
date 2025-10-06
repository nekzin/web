
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  deleteStudentApi,
  getStudentsApi,
  createStudentApi, 
} from '@/api/studentsApi';
import type StudentInterface from '@/types/StudentInterface';

interface StudentsHookInterface {
  students: StudentInterface[];
  deleteStudentMutate: (studentId: number) => void;
  createStudentMutate: (data: {
  firstName: string;
  lastName: string;
  patronymic: string;
  groupId: number;
}) => void;
  isCreating: boolean; 
}

const useStudents = (): StudentsHookInterface => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudentsApi(),
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: number) => deleteStudentApi(studentId),
    onMutate: async (studentId: number) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData<StudentInterface[]>(['students']);
      const updatedStudents = [...(previousStudents ?? [])].map((student) =>
        student.id === studentId ? { ...student, isDeleted: true } : student
      );
      queryClient.setQueryData(['students'], updatedStudents);
      return { previousStudents };
    },
    onError: (err, variables, context) => {
      console.log('>>> deleteStudentMutate err', err);
      queryClient.setQueryData(['students'], context?.previousStudents);
    },
    onSuccess: (studentId, _variables, context) => {
      const previousStudents = context?.previousStudents;
      if (!previousStudents) return;
      const updatedStudents = previousStudents.filter((s) => s.id !== studentId);
      queryClient.setQueryData(['students'], updatedStudents);
    },
  });

const createStudentMutation = useMutation({
  mutationFn: (data: {
    firstName: string;
    lastName: string;
    patronymic: string;
    groupId: number;
  }) => createStudentApi(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
  },
});

  return {
    students: data ?? [],
    deleteStudentMutate: deleteStudentMutation.mutate,
    createStudentMutate: createStudentMutation.mutate,
    isCreating: createStudentMutation.isPending, 
  };
};

export default useStudents;
