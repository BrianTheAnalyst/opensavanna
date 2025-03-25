
import { Link } from 'react-router-dom';
import { GitHubIcon, TwitterIcon, LinkedInIcon } from './SocialIcons';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-primary font-medium">
              <svg 
                className="w-6 h-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 2L2 7L12 12L22 7L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 17L12 22L22 17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 12L12 17L22 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg tracking-tight">OpenData</span>
            </Link>
            <p className="text-sm text-foreground/70">
              Making data accessible, usable, and valuable for researchers, policymakers, journalists, and developers.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/datasets" className="text-foreground/70 hover:text-primary transition-colors">
                  All Datasets
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-foreground/70 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/regions" className="text-foreground/70 hover:text-primary transition-colors">
                  Regions
                </Link>
              </li>
              <li>
                <Link to="/formats" className="text-foreground/70 hover:text-primary transition-colors">
                  Data Formats
                </Link>
              </li>
              <li>
                <Link to="/visualizations" className="text-foreground/70 hover:text-primary transition-colors">
                  Visualizations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/api" className="text-foreground/70 hover:text-primary transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-foreground/70 hover:text-primary transition-colors">
                  User Guides
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-foreground/70 hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-foreground/70 hover:text-primary transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-foreground/70 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground/70 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-foreground/70 hover:text-primary transition-colors">
                  Feedback
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="text-foreground/70 hover:text-primary transition-colors">
                  Contribute Data
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="text-foreground/70 hover:text-primary transition-colors">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-foreground/60">
            &copy; {new Date().getFullYear()} OpenData Platform. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/license" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              Data License
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
