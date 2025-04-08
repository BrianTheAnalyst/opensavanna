
// Re-export from sonner for consistency across the app
import { toast } from "sonner";

// This ensures backward compatibility with any existing uses of useToast
export const useToast = () => {
  return {
    toast,
    toasts: [] // Dummy value for backward compatibility
  };
};

export { toast };
