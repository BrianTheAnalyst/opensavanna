
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDatasetById } from '@/services/datasetService';
import { isUserAdmin } from '@/services/userRoleService';
import DatasetEditForm from '@/components/admin/DatasetEditForm';

const DatasetEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [dataset, setDataset] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndLoadDataset = async () => {
      setIsLoading(true);
      try {
        // Check if user is admin
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          navigate('/datasets');
          return;
        }
        
        // Load dataset
        if (id) {
          const data = await getDatasetById(id);
          if (data) {
            setDataset(data);
          } else {
            navigate('/datasets');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminAndLoadDataset();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-foreground/70">Loading dataset...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin || !dataset) {
    navigate('/datasets');
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-[80vh]">
        <DatasetEditForm dataset={dataset} />
      </div>
      <Footer />
    </div>
  );
};

export default DatasetEditPage;
