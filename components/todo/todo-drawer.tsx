'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { AddTodoForm } from './todo-form';
import { PlusCircleIcon } from 'lucide-react';

export function TodoDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="elevated">
          Add To‑Do
          <PlusCircleIcon className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-full">
        <DrawerHeader>
          <DrawerTitle>Add To‑Do</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0">
          <AddTodoForm onSuccess={() => setOpen(false)} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
