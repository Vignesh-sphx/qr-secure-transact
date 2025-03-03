
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import { 
  QrCode,
  Shield,
  Zap,
  Wifi,
  Lock,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-16 px-4 text-center relative overflow-hidden bg-primary/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative z-10 max-w-screen-lg mx-auto">
            <div className="inline-flex h-12 items-center justify-center rounded-full bg-primary/10 px-6 mb-8">
              <span className="text-sm font-medium text-primary animate-pulse">
                Secure Off-chain Transactions
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Secure Transactions <span className="text-primary">Without Internet</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Process transactions securely through QR codes, even when offline. Featuring cryptographic keys and smart contract fraud prevention.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-shine">
                <Link to="/authentication">Create Digital Wallet</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/transaction">Start Transacting</Link>
              </Button>
            </div>
            
            <div className="mt-16 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-xl bg-white shadow-2xl perspective-container overflow-hidden">
                    {/* Simulated app screen */}
                    <div className="w-full h-full bg-gray-100 flex flex-col">
                      <div className="h-10 bg-white flex items-center px-3 border-b">
                        <div className="w-3 h-3 rounded-full bg-red-400 mr-2" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 flex items-center justify-center p-4">
                        <div className="w-full h-full bg-white rounded-lg shadow-md flex items-center justify-center">
                          <QrCode className="h-24 w-24 text-primary animate-float" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-blue-100 animate-float" style={{ animationDelay: '0.5s' }} />
                <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-green-100 animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/4 -left-10 w-8 h-8 rounded-full bg-yellow-100 animate-float" style={{ animationDelay: '1.5s' }} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="max-w-screen-lg mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform combines advanced cryptography with intuitive design to provide secure offline transactions
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={<QrCode className="h-6 w-6 text-primary" />}
                title="QR Code Transactions"
                description="Transfer funds securely between devices using QR codes, enabling transactions without internet connectivity"
              />
              
              <FeatureCard 
                icon={<Shield className="h-6 w-6 text-primary" />}
                title="Cryptographic Security"
                description="Each transaction is secured using public-private key cryptography, ensuring authenticity and integrity"
              />
              
              <FeatureCard 
                icon={<Lock className="h-6 w-6 text-primary" />}
                title="Smart Contract Protection"
                description="Advanced smart contracts prevent double-spending and fraud, verifying transactions when devices reconnect"
              />
              
              <FeatureCard 
                icon={<Wifi className="h-6 w-6 text-primary" />}
                title="Offline Capability"
                description="Complete transactions anywhere, even without internet access, with full security guarantees"
              />
              
              <FeatureCard 
                icon={<Zap className="h-6 w-6 text-primary" />}
                title="Instant Verification"
                description="Transactions are verified instantly on-device, then synchronized with the blockchain when online"
              />
              
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg overflow-hidden card-shadow">
                <div className="p-6 h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-2">Ready to Start?</h3>
                  <p className="text-sm mb-6 flex-grow">
                    Create your digital wallet and experience secure transactions right now
                  </p>
                  <Button asChild variant="default" className="w-full justify-between group">
                    <Link to="/authentication">
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 px-4">
          <div className="max-w-screen-lg mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our simple process makes secure offline transactions accessible to everyone
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Your Wallet</h3>
                <p className="text-muted-foreground">
                  Generate your secure cryptographic keys to establish your digital identity
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Initiate Transfer</h3>
                <p className="text-muted-foreground">
                  Create a transaction and generate a QR code containing the signed transaction data
                </p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Transaction</h3>
                <p className="text-muted-foreground">
                  The recipient scans the QR code to receive the transaction, which is later verified on the blockchain
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link to="/transaction">Try It Now</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 px-4 border-t mt-auto">
          <div className="max-w-screen-lg mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <QrCode className="h-5 w-5 text-primary mr-2" />
              <span className="font-semibold">SecureTransact</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SecureTransact. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
      <NavBar />
      
      {/* Add grid pattern for background */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .perspective-container {
          transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
          transition: transform 0.3s ease;
        }
        
        .perspective-container:hover {
          transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
        }
      `}</style>
    </>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="card-shadow h-full">
      <CardHeader className="pb-2">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Index;
