
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, Copy, Check, Lock } from 'lucide-react';
import { useTransaction } from '@/context/TransactionContext';
import { cn } from '@/lib/utils';

const KeyPair: React.FC = () => {
  const { state, createWallet } = useTransaction();
  const { wallet, isLoading } = state;
  
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatKey = (key: string | undefined) => {
    if (!key) return '';
    return key.length > 40 ? `${key.substring(0, 10)}...${key.substring(key.length - 10)}` : key;
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 card-shadow">
      <CardHeader className="space-y-1 bg-secondary/30">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Digital Key Pair</CardTitle>
        </div>
        <CardDescription>
          Your secure cryptographic identity for transactions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-5">
        {wallet ? (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Public Key</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(wallet.publicKey, 'public')}
                >
                  {copied === 'public' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy public key</span>
                </Button>
              </div>
              
              <div className="p-3 rounded-md bg-muted font-mono text-xs break-all">
                {formatKey(wallet.publicKey)}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">Private Key</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => copyToClipboard(wallet.privateKey, 'private')}
                >
                  {copied === 'private' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy private key</span>
                </Button>
              </div>
              
              <div className="p-3 rounded-md bg-muted font-mono text-xs break-all relative group">
                <div className="absolute inset-0 bg-muted flex items-center justify-center group-hover:opacity-0 transition-opacity rounded-md">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs font-medium">Hover to reveal</span>
                  </div>
                </div>
                {formatKey(wallet.privateKey)}
              </div>
              
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-destructive font-semibold">Warning:</span> Never share your private key. 
                It provides complete control over your digital identity.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="mb-4 flex justify-center">
              <Key className="h-12 w-12 text-primary/30" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Wallet Detected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a secure wallet to start making transactions.
            </p>
            <Button 
              onClick={createWallet} 
              disabled={isLoading}
              className={cn(
                "w-full transition-all btn-shine",
                isLoading && "opacity-80"
              )}
            >
              {isLoading ? "Creating Wallet..." : "Create Wallet"}
            </Button>
          </div>
        )}
      </CardContent>
      
      {wallet && (
        <CardFooter className="bg-secondary/20 px-4 py-3">
          <div className="w-full flex justify-between items-center">
            <span className="text-sm font-medium">Balance:</span>
            <span className="text-lg font-semibold">{wallet.balance} Units</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default KeyPair;
