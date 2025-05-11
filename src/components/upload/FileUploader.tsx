
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validTypes = ['text/csv', 'application/json', 'application/geo+json'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload CSV, JSON, or GeoJSON");
      return;
    }
    
    onFileChange(file);
    
    // Preview for text files
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const preview = content.slice(0, 200) + (content.length > 200 ? '...' : '');
      setFilePreview(preview);
    };
    reader.readAsText(file);
  };

  return (
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
    </div>
  );
};

export default FileUploader;
