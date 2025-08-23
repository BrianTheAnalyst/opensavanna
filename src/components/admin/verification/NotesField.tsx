
import React from 'react';

import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  action: 'approve' | 'reject';
  notes: string;
  setNotes: (notes: string) => void;
}

const NotesField: React.FC<NotesFieldProps> = ({ action, notes, setNotes }) => {
  return (
    <div>
      <label className="text-sm text-foreground/70 mb-1 block">
        {action === 'approve' 
          ? 'Add any notes or comments (optional)' 
          : 'Please provide a reason for rejection'}
      </label>
      <Textarea
        value={notes}
        onChange={(e) => { setNotes(e.target.value); }}
        placeholder={action === 'approve' 
          ? 'Add any notes or comments...' 
          : 'Reason for rejection...'}
        rows={4}
      />
    </div>
  );
};

export default NotesField;
