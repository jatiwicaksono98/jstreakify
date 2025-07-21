'use client';

import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { CreateHabitForm } from './create-habit-form';

export function CreateHabitDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default" className="w-full">
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Habit
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Buat Habit Baru</h2>
          <CreateHabitForm onSuccess={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
