import { Edit2Icon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Drawer } from '../ui/drawer';
import { DrawerTrigger, DrawerContent } from '../ui/drawer';
import { EditHabitForm } from './edit-habit-form';

export function EditHabitDrawer({
  habitId,
  initialName,
  initialDescription,
}: {
  habitId: string;
  initialName: string;
  initialDescription: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <Edit2Icon className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Edit Habit</h2>
          {/* Only mount form if drawer is open */}
          {open && (
            <EditHabitForm
              habitId={habitId}
              initialName={initialName}
              initialDescription={initialDescription}
              onSuccess={() => setOpen(false)}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
