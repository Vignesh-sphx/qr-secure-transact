
import React from 'react';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import KeyPair from '@/components/KeyPair';
import { Shield, Key, Lock, CreditCard, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTransaction } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Authentication: React.FC = () => {
  const { state } = useTransaction();
  const { wallet } = state;

  return (
    <>
      <Header />
      <div className="page-container pb-20 md:pb-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Authentication</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Secure your identity with cryptographic keys for transaction authentication
          </p>
        </div>
        
        <div className="grid gap-8 max-w-3xl mx-auto w-full">
          {/* Key Pair Component */}
          <KeyPair />
          
          {/* Credits Card */}
          {wallet && (
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Card className="card-shadow overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="flex items-center text-lg">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Your Credits
                  </CardTitle>
                  <CardDescription>
                    Use credits for transactions in the network
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
                      <p className="text-3xl font-bold">{wallet.balance}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-dashed"
                      disabled
                    >
                      Add Credits
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Credits are automatically granted when you create a wallet for demo purposes.
                    In a real application, you would purchase or earn these credits.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Bank Account Linking (for future implementation) */}
          {wallet && (
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Card className="card-shadow overflow-hidden">
                <CardHeader className="bg-secondary/20">
                  <CardTitle className="flex items-center text-lg">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Link Bank Account
                  </CardTitle>
                  <CardDescription>
                    Connect your bank account to add or withdraw funds
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Account Number</p>
                    <Input
                      type="text"
                      placeholder="Enter your account number"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Routing Number</p>
                    <Input
                      type="text"
                      placeholder="Enter your routing number"
                      disabled
                    />
                  </div>
                  <Button className="w-full" disabled>
                    Connect Bank Account
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This feature is not available in the demo. In a production app, 
                    you would be able to link your bank account securely through a payment processor.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Security Information */}
          {wallet && (
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Lock className="h-5 w-5 mr-2 text-primary" />
                    Security Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-medium">Public Key</h3>
                    <p className="text-sm text-muted-foreground">
                      Your public key serves as your identity in the network. Share it with others to receive transactions.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">Private Key</h3>
                    <p className="text-sm text-muted-foreground">
                      Your private key is used to sign transactions and prove ownership. Never share it with anyone.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">Key Storage</h3>
                    <p className="text-sm text-muted-foreground">
                      In this demo, keys are stored in your browser's local storage. In a production app, private keys would be stored in a secure enclave or hardware wallet.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium">Signature Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      When you create a transaction, it's signed with your private key. Recipients can verify the signature using your public key.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <NavBar />
    </>
  );
};

export default Authentication;

