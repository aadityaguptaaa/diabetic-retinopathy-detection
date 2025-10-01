import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Shield, Zap, Users, ArrowRight, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Eye,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze retinal images with clinical-grade accuracy"
    },
    {
      icon: Shield,
      title: "Early Detection",
      description: "Detect diabetic retinopathy stages from No DR to Proliferative with confidence scores"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get comprehensive analysis results within seconds, not days"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Designed for patients, clinicians, and administrators with role-based features"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              RetinaAI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="medical" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered Retinal Screening
            <br />
            <span className="text-primary-light">for Early DR Detection</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Revolutionizing diabetic retinopathy screening with advanced AI technology. 
            Get instant, accurate analysis of retinal images with clinical-grade precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="hero"
              className="text-lg px-8 py-4"
              onClick={() => navigate('/upload')}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Retinal Image
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 bg-white/10 text-white border-white/30 hover:bg-white/20"
              onClick={() => navigate('/signup')}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Advanced AI Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge platform combines the latest in machine learning with medical expertise 
              to provide accurate, reliable diabetic retinopathy screening.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-gradient-card shadow-card hover:shadow-medical transition-all duration-300 border-0">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-accent mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-secondary-accent/80 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals using RetinaAI for early diabetic retinopathy detection.
          </p>
          <Button 
            size="lg" 
            variant="medical"
            className="text-lg px-8 py-4"
            onClick={() => navigate('/signup')}
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">RetinaAI</span>
            </div>
            <p className="text-sm text-background/70">
              © 2025 RetinaAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;