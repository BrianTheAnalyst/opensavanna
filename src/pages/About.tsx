
import { ArrowRight, Leaf, Database, Users, Globe } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";


const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Data Scientist',
      bio: 'Previously worked with international data initiatives across Africa. PhD in Data Science from MIT.'
    },
    {
      name: 'Emmanuel Okafor',
      role: 'Lead Developer',
      bio: 'Full-stack developer with 8+ years experience building data platforms. Computer Science graduate from University of Cape Town.'
    },
    {
      name: 'Amina Nkosi',
      role: 'Partnerships Director',
      bio: 'Former policy advisor with extensive connections to government and NGO data providers across the continent.'
    },
    {
      name: 'Daniel Mensah',
      role: 'UX/UI Designer',
      bio: 'Award-winning designer focused on creating accessible interfaces for data visualization and exploration.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-muted/30 py-16">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Our Mission
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                About OpenSavanna
              </h1>
              <p className="text-foreground/70 mb-8 text-lg">
                We're building Africa's premier open data platform to democratize access to valuable datasets, 
                foster data-driven decision making, and support innovation across the continent.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={`transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                  Our Vision
                </div>
                <h2 className="text-3xl font-medium tracking-tight mb-4">
                  Democratizing Data Access Across Africa
                </h2>
                <p className="text-foreground/70 mb-6">
                  OpenSavanna was founded on the belief that open data is essential for addressing the continent's 
                  most pressing challenges. By making high-quality datasets accessible and usable, we aim to empower 
                  researchers, policymakers, journalists, and developers to drive positive change.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    { 
                      icon: Database, 
                      title: 'Data Accessibility', 
                      description: 'Making valuable datasets discoverable and available in accessible formats.' 
                    },
                    { 
                      icon: Leaf, 
                      title: 'Sustainable Development', 
                      description: 'Supporting data-driven solutions to environmental and social challenges.' 
                    },
                    { 
                      icon: Users, 
                      title: 'Community Building', 
                      description: 'Fostering a collaborative ecosystem of data providers and users.' 
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4 mt-1">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        <p className="text-sm text-foreground/70">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`glass border border-border/50 rounded-xl overflow-hidden shadow-lg transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-secondary bg-secondary/10 rounded-full">
                    Our Impact
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { value: '2,400+', label: 'Datasets Available' },
                      { value: '54', label: 'African Countries Covered' },
                      { value: '120+', label: 'Partner Organizations' },
                      { value: '45,000+', label: 'Monthly Active Users' }
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center">
                        <div className="text-3xl font-medium text-primary mr-4 w-24">{stat.value}</div>
                        <div className="text-foreground/70">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Our Team
              </div>
              <h2 className="text-3xl font-medium tracking-tight mb-4">
                Meet the People Behind OpenSavanna
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Our diverse team combines expertise in data science, software development, 
                policy, and design to build a platform that serves the needs of data users across Africa.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className={`glass border border-border/50 rounded-xl p-6 transition-all duration-500 hover:shadow-md transform ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    <span className="text-xl font-medium">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-lg font-medium text-center mb-2">{member.name}</h3>
                  <p className="text-primary text-sm text-center mb-3">{member.role}</p>
                  <p className="text-sm text-foreground/70 text-center">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Partners Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/10 rounded-full">
                Our Network
              </div>
              <h2 className="text-3xl font-medium tracking-tight mb-4">
                Partners & Supporters
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                We collaborate with a diverse range of organizations to source, validate, and distribute open data.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i}
                  className="h-24 glass-light rounded-lg flex items-center justify-center border border-border/50"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container px-4 mx-auto text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary bg-primary/20 rounded-full">
                Join Us
              </div>
              <h2 className="text-3xl font-medium tracking-tight mb-4">
                Interested in Contributing?
              </h2>
              <p className="text-foreground/70 mb-8">
                Whether you're looking to share datasets, build applications, or join our team, 
                we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contribute">
                  <Button size="lg" className="rounded-full group">
                    <span>Contribute Data</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
