
import * as z from "zod";

// Form validation schema
export const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  country: z.string().min(1, { message: "Please select a country" }),
  format: z.string().min(1, { message: "Please select a format" }),
  file: z.any().optional() // Make file optional
});

export type FormValues = z.infer<typeof formSchema>;
