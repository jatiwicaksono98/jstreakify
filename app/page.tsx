import { Button } from '@/components/ui/button';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div>
      <Button variant="elevated">Elevated Styled Btn</Button>
    </div>
  );
}
