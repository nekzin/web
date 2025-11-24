import { notFound } from 'next/navigation';
import Student from '@/components/Student/Student';
import Page from '@/components/layout/Page/Page';
import { META_DESCRIPTION, META_TITLE } from '@/constants/meta';
import { type Metadata } from 'next/types';
import { getStudentByIdApi } from '@/api/studentsApi';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params;

  const student = await getStudentByIdApi(id);

  return {
    title: student ? `${student.lastName} ${student.firstName} ${student.middleName} -- ${META_TITLE}` : `студент не найден -- ${META_TITLE}`,
    description: META_DESCRIPTION,

  };
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const StudentsPage = async ({ params }: PageProps): Promise<React.ReactNode> => {
  const { id } = await params;
  const student = await getStudentByIdApi(id);

  if (!student) {
    notFound();
  }
  return (
    <Page>
      <Student student={student} />
    </Page>
  );
};

export default StudentsPage;
