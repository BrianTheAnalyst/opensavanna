
import { toast } from "sonner";

// Re-export the toast function from sonner
export { toast };

// Provide a legacy interface for backward compatibility with shadcn/ui toast
export const useToast = () => {
  return {
    toast: ({ title, description, variant }: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
      if (variant === 'destructive') {
        toast.error(title || "", {
          description
        });
      } else {
        toast(title || "", {
          description
        });
      }
    },
    toasts: [] // For compatibility with shadcn/ui toast
  };
};
