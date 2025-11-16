import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg transition-all duration-300">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Shield className="w-6 h-6 text-neutral-950" />
            </div>
            <span className="text-xl font-bold text-foreground">CyberDefense</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="text-foreground/80 font-medium text-sm transition-colors duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-foreground/80 font-medium text-sm transition-colors duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Pricing
            </a>
            <a 
              href="#docs" 
              className="text-foreground/80 font-medium text-sm transition-colors duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Docs
            </a>
            <a 
              href="#contact" 
              className="text-foreground/80 font-medium text-sm transition-colors duration-200 hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </a>
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-primary text-neutral-950 hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(188_100%_50%/0.3)] active:scale-95 transition-all">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button 
                    variant="ghost" 
                    className="bg-transparent text-foreground hover:bg-accent/10 active:scale-95 transition-all"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    className="bg-primary text-neutral-950 hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(188_100%_50%/0.3)] active:scale-95 transition-all"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-lg transition-all duration-300 top-16">
          <nav className="flex flex-col items-center gap-6 p-8">
            <a 
              href="#features" 
              className="text-lg text-foreground/80 font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-lg text-foreground/80 font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#docs" 
              className="text-lg text-foreground/80 font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </a>
            <a 
              href="#contact" 
              className="text-lg text-foreground/80 font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="flex flex-col w-full gap-3 mt-4">
              <Button 
                variant="outline" 
                className="w-full border-2 border-primary bg-transparent text-primary hover:bg-primary/10"
              >
                Sign In
              </Button>
              <Button 
                className="w-full bg-primary text-neutral-950 hover:bg-primary/90"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
