
import React, { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['text/csv', 'application/json', 'application/geo+json'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload CSV, JSON, or GeoJSON");
      return;
    }
    
    setIsLoading(true);
    setFileName(file.name);
    onFileChange(file);
    
    // Preview for text files
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const preview = content.slice(0, 200) + (content.length > 200 ? '...' : '');
      setFilePreview(preview);
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      toast.error("Failed to read file");
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-2">
      <FormLabel htmlFor="file-upload">Upload File</FormLabel>
      <div 
        className="glass border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center"
        tabIndex={0}
        role="button"
        aria-controls="file-upload"
        onClick={() => document.getElementById('file-upload')?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            document.getElementById('file-upload')?.click();
          }
        }}
      >
        {isLoading ? (
          <Loader2 className="h-10 w-10 text-primary/60 animate-spin mb-2" aria-hidden="true" />
        ) : (
          <UploadCloud className="h-10 w-10 text-primary/60 mb-2" aria-hidden="true" />
        )}
        
        <p className="text-sm text-center mb-2">
          {fileName ? `Selected file: ${fileName}` : 'Drag and drop your file here or click to browse'}
        </p>
        <p className="text-xs text-foreground/60 mb-3" id="file-format-help">
          Accepted formats: CSV, JSON, GeoJSON (max 10MB)
        </p>
        <Input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv,.json,.geojson"
          onChange={handleFileChange}
          aria-describedby="file-format-help"
          disabled={isLoading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById('file-upload')?.click();
          }}
          className="text-xs"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Processing...' : 'Select File'}
        </Button>
        
        {filePreview && (
          <div className="mt-4 w-full">
            <div className="text-xs font-medium mb-1">File Preview:</div>
            <div 
              className="glass bg-muted/30 rounded-md p-3 text-xs font-mono whitespace-pre-wrap"
              aria-label="File content preview"
            >
              {filePreview}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
