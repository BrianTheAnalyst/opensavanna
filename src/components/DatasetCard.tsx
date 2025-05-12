import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, DownloadCloud, Eye, BarChart3, MapPin, FileText, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { deleteDataset, isUserAdmin } from '@/services/datasetAdminService';
import { toast } from "sonner";

interface DatasetCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  country: string;
  date: string;
  downloads: number;
  type: 'default' | 'featured' | 'compact';
  onDelete?: () => void;
}

const DatasetCard = ({ 
  id, 
  title, 
  description, 
  category, 
  format, 
  country, 
  date, 
  downloads, 
  type = 'default',
  onDelete
}: DatasetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  const formatIcons: Record<string, JSX.Element> = {
    'CSV': <FileText className="h-4 w-4" />,
    'JSON': <FileText className="h-4 w-4" />,
    'GeoJSON': <MapPin className="h-4 w-4" />,
    'Chart': <BarChart3 className="h-4 w-4" />,
  };
  
  // Check if user is admin - fix: remove the second argument
  useState(() => {
    const checkAdmin = async () => {
      const admin = await isUserAdmin();
      setIsAdmin(admin);
    };
    checkAdmin();
  }, []);
  
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation when clicking the button
    console.log(`Downloading dataset: ${id}`);
    // Add download logic here
  };

  // Handle dataset deletion
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setIsDeleting(true);
      
      try {
        console.log(`Deleting dataset with ID: ${id}`);
        const success = await deleteDataset(id);
        
        if (success) {
          toast.success(`Dataset "${title}" deleted successfully`);
          // Call the onDelete callback to refresh the parent component
          if (onDelete) {
            console.log("Calling onDelete callback after successful deletion");
            onDelete();
          }
        } else {
          toast.error("Failed to delete dataset");
        }
      } catch (error) {
        console.error("Error during dataset deletion:", error);
        toast.error("An error occurred while deleting the dataset");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  if (type === 'compact') {
    return (
      <Link 
        to={`/datasets/${id}`}
        className="block glass border border-border/50 rounded-xl p-3 transition-all duration-300 hover:shadow-md hover:border-primary/20 cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium line-clamp-1">{title}</h3>
            <p className="text-xs text-foreground/60 line-clamp-1">{country}</p>
          </div>
          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
            {formatIcons[format] || formatIcons['CSV']}
          </span>
        </div>
        {isAdmin && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </Link>
    );
  }
  
  if (type === 'featured') {
    return (
      <div 
        className="group relative glass border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-0 left-0 p-3 z-10">
          <div className="text-xs px-2 py-1 bg-primary text-white rounded-full">
            Featured
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-1">{title}</h3>
            <p className="text-foreground/70">{description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-foreground/60">Category</p>
              <p className="text-sm font-medium">{category}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">Region</p>
              <p className="text-sm font-medium">{country}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">Format</p>
              <div className="flex items-center">
                {formatIcons[format] || formatIcons['CSV']}
                <span className="ml-1 text-sm font-medium">{format}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-foreground/60">Downloads</p>
              <p className="text-sm font-medium">{downloads.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 rounded-lg text-xs cursor-pointer"
              onClick={handleDownload}
            >
              <DownloadCloud className="mr-1 h-3 w-3" />
              Download
            </Button>
            <Link to={`/datasets/${id}`} className="flex-1">
              <Button 
                size="sm" 
                className="w-full rounded-lg text-xs group-hover:bg-primary/90 cursor-pointer"
              >
                <Eye className="mr-1 h-3 w-3" />
                Explore
              </Button>
            </Link>
          </div>
          
          {isAdmin && (
            <div className="mt-3">
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete Dataset'}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default card
  return (
    <div className="relative">
      <Link 
        to={`/datasets/${id}`}
        className="block relative glass border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full flex items-center">
                {formatIcons[format] || formatIcons['CSV']}
                <span className="ml-1">{format}</span>
              </span>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                {category}
              </span>
            </div>
            <span className="text-xs text-foreground/60">{date}</span>
          </div>
          
          <h3 className="text-lg font-medium mb-1 pr-6 group-hover:text-primary transition-colors">
            {title}
            <ArrowUpRight 
              className={`inline-block ml-1 h-3 w-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} 
            />
          </h3>
          <p className="text-sm text-foreground/70 line-clamp-2 mb-3">{description}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-foreground/60">
              <span className="inline-flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {country}
              </span>
            </div>
            <div className="text-xs text-foreground/60">
              <span className="inline-flex items-center">
                <DownloadCloud className="h-3 w-3 mr-1" />
                {downloads.toLocaleString()} downloads
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      {isAdmin && (
        <div className="mt-2 flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DatasetCard;
