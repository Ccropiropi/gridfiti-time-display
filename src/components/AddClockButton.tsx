import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddClockButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function AddClockButton({ onClick, disabled }: AddClockButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="
        fixed bottom-8 right-8 z-40 h-16 w-16 rounded-full 
        clock-glass hover-lift animate-float
        shadow-lg hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      <Plus className="h-8 w-8" />
      <span className="sr-only">Add new clock</span>
    </Button>
  );
}