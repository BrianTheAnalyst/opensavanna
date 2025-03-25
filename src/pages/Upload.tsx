
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { UploadCloud, Info, FileType, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  country: z.string().min(1, { message: "Please select a country" }),
  file: z.instanceof(File, { message: "Please upload a file" })
});

type FormValues = z.infer<typeof formSchema>;

const UploadPage = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      country: ""
    }
  });
  
  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['text/csv', 'application/json', 'application/geo+json'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload CSV, JSON, or GeoJSON");
      return;
    }
    
    form.setValue("file", file);
    
    // Preview for text files
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const preview = content.slice(0, 200) + (content.length > 200 ? '...' : '');
      setFilePreview(preview);
    };
    reader.readAsText(file);
  };
  
  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsUploading(true);
    
    try {
      // Mock API call - In a real app, you would use axios or fetch to send to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock success
      toast.success("Dataset uploaded successfully!");
      setUploadStep(2);
      
      // Navigate to datasets page after short delay
      setTimeout(() => {
        navigate('/datasets');
      }, 2000);
      
    } catch (error) {
      toast.error("Failed to upload dataset. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const categories = [
    { label: 'Economics', value: 'economics' },
    { label: 'Health', value: 'health' },
    { label: 'Transport', value: 'transport' },
    { label: 'Agriculture', value: 'agriculture' },
    { label: 'Education', value: 'education' },
    { label: 'Environment', value: 'environment' },
    { label: 'Demographics', value: 'demographics' },
    { label: 'Government', value: 'government' }
  ];
  
  const countries = [
    { label: 'East Africa', value: 'east-africa' },
    { label: 'West Africa', value: 'west-africa' },
    { label: 'South Africa', value: 'south-africa' },
    { label: 'North Africa', value: 'north-africa' },
    { label: 'Central Africa', value: 'central-africa' },
    { label: 'Global', value: 'global' },
    { label: 'Kenya', value: 'kenya' },
    { label: 'Nigeria', value: 'nigeria' },
    { label: 'Ghana', value: 'ghana' },
    { label: 'Ethiopia', value: 'ethiopia' }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <section className="bg-muted/30 py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Contribute Data
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                Upload a New Dataset
              </h1>
              <p className="text-foreground/70 mb-4">
                Share your datasets with the community. We accept CSV, JSON, and GeoJSON formats.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="glass border border-border/50 rounded-xl p-6 md:p-8">
                {uploadStep === 1 ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Title field */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dataset Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter a descriptive title" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Description field */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <textarea 
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                rows={4}
                                placeholder="Describe the dataset, its source, and potential uses"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category field */}
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                  {...field}
                                >
                                  <option value="">Select a category</option>
                                  {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                      {category.label}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Country/Region field */}
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country/Region</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                  {...field}
                                >
                                  <option value="">Select a region</option>
                                  {countries.map(country => (
                                    <option key={country.value} value={country.value}>
                                      {country.label}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* File upload */}
                      <div className="space-y-2">
                        <FormLabel>Upload File</FormLabel>
                        <div className="glass border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center">
                          <UploadCloud className="h-10 w-10 text-primary/60 mb-2" />
                          <p className="text-sm text-center mb-2">
                            Drag and drop your file here or click to browse
                          </p>
                          <p className="text-xs text-foreground/60 mb-3">
                            Accepted formats: CSV, JSON, GeoJSON (max 10MB)
                          </p>
                          <Input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".csv,.json,.geojson"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="text-xs"
                          >
                            Select File
                          </Button>
                          
                          {filePreview && (
                            <div className="mt-4 w-full">
                              <div className="text-xs font-medium mb-1">File Preview:</div>
                              <div className="glass bg-muted/30 rounded-md p-3 text-xs font-mono whitespace-pre-wrap">
                                {filePreview}
                              </div>
                            </div>
                          )}
                        </div>
                        {form.formState.errors.file && (
                          <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.file.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isUploading}
                        >
                          {isUploading ? 'Uploading...' : 'Upload Dataset'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Upload Successful!</h3>
                    <p className="text-foreground/70 mb-6">
                      Your dataset has been uploaded and is now available for the community.
                    </p>
                    <Button onClick={() => navigate('/datasets')}>
                      View All Datasets
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="mt-10 space-y-6">
                <div className="glass border border-border/50 rounded-xl p-6">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Dataset Guidelines</h3>
                      <ul className="text-sm text-foreground/70 space-y-2 list-disc pl-4">
                        <li>Ensure your data is properly structured with clear headers and consistent formatting.</li>
                        <li>Include metadata and sources to provide context for your dataset.</li>
                        <li>Remove any personal or sensitive information before uploading.</li>
                        <li>For geospatial data, ensure coordinates are in standard format (WGS84).</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="glass border border-border/50 rounded-xl p-6">
                  <div className="flex items-start">
                    <FileType className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Supported File Formats</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div className="glass-light rounded-lg p-3">
                          <div className="text-sm font-medium mb-1">CSV</div>
                          <p className="text-xs text-foreground/70">Standard tabular data format</p>
                        </div>
                        <div className="glass-light rounded-lg p-3">
                          <div className="text-sm font-medium mb-1">JSON</div>
                          <p className="text-xs text-foreground/70">Structured data objects</p>
                        </div>
                        <div className="glass-light rounded-lg p-3">
                          <div className="text-sm font-medium mb-1">GeoJSON</div>
                          <p className="text-xs text-foreground/70">Geospatial vector data</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadPage;
