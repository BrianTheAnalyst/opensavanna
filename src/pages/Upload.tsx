
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import UploadForm from '@/components/upload/UploadForm';
import UploadGuidelines from '@/components/upload/UploadGuidelines';
import UploadHeader from '@/components/upload/UploadHeader';
import { supabase } from '@/integrations/supabase/client';

const UploadPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      
      if (!user) {
        toast.info('You need to be logged in to upload datasets.');
        // For now we'll just show a notification without redirecting
      }
    };
    
    checkAuth();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <UploadHeader />
        
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="glass border border-border/50 rounded-xl p-6 md:p-8">
                {!isLoggedIn && (
                  <p className="text-destructive mb-4 text-center">
                    You need to be logged in to upload datasets.
                  </p>
                )}
                <UploadForm isLoggedIn={isLoggedIn} />
              </div>
              
              <UploadGuidelines />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadPage;
