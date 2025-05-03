
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import UploadForm from '@/components/upload/UploadForm';
import UploadPageHeader from '@/components/upload/UploadPageHeader';
import DatasetGuidelines from '@/components/upload/DatasetGuidelines';
import FileFormatsInfo from '@/components/upload/FileFormatsInfo';

const UploadPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <UploadPageHeader isLoggedIn={isLoggedIn} />
        
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="glass border border-border/50 rounded-xl p-6 md:p-8">
                <UploadForm isLoggedIn={isLoggedIn} />
              </div>
              
              <div className="mt-10 space-y-6">
                <DatasetGuidelines />
                <FileFormatsInfo />
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
