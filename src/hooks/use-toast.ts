
import { toast } from "sonner";

// Re-export the toast function from sonner
export { toast };

// Provide a legacy interface for backward compatibility with shadcn/ui toast
export const useToast = () => {
  return {
    toast: ({ title, description }: { title?: string; description?: string }) => {
      toast(title || "", {
        description
      })
    },
    toasts: [] // For compatibility with shadcn/ui toast
  };
};
