// app/page.tsx
import { HomeContent } from '@/components/home/home-content';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { getHabitsForDate } from '@/server/queries/get-today-habits';
import { parseISO, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

type Props = {
  searchParams: {
    date?: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  const today = new Date();
  const parsedDate = searchParams.date ? parseISO(searchParams.date) : today;

  const isDateValid = isValid(parsedDate);
  const targetDate = isDateValid ? parsedDate : today;

  const formattedDateForDB = formatInTimeZone(
    targetDate,
    'Asia/Jakarta',
    'yyyy-MM-dd'
  );

  const habits = await getHabitsForDate(session.user.id, formattedDateForDB);

  return (
    <HomeContent
      userId={session.user.id}
      initialDate={targetDate}
      initialHabits={habits}
    />
  );
}
