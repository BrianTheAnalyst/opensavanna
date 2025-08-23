
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import VerificationTabs from '@/components/admin/verification/VerificationTabs';
import { isUserAdmin } from '@/services/userRoleService';

const DatasetVerificationPage = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        navigate('/datasets');
      }
      
      setLoading(false);
    };
    
    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-foreground/70">Loading verification dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 min-h-[80vh]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Dataset Verification Dashboard</h1>
          <p className="text-foreground/70">
            Review, approve, or reject submitted datasets.
          </p>
        </div>
        
        <VerificationTabs />
      </div>
      <Footer />
    </div>
  );
};

export default DatasetVerificationPage;
