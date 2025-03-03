
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import QRGenerator from '@/components/QRGenerator';
import QRScanner from '@/components/QRScanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownLeft, QrCode, Check } from 'lucide-react';
import { TransactionData } from '@/utils/cryptography';
import { useTransaction } from '@/context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Transaction: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, sendTransaction, hasWallet } = useTransaction();
  const { isLoading } = state;
  
  const initialTab = searchParams.get('tab') === 'receive' ? 'receive' : 'send';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Send state
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  
  // Receive state
  const [receivedTransaction, setReceivedTransaction] = useState<TransactionData | null>(null);
  
  useEffect(() => {
    // Update tab based on URL parameters
    const tab = searchParams.get('tab');
    if (tab === 'receive') {
      setActiveTab('receive');
    }
  }, [searchParams]);
  
  const handleSend = async () => {
    if (!recipient) {
      toast({
        variant: "destructive",
        title: "Recipient Required",
        description: "Please enter a recipient address",
      });
      return;
    }
    
    if (!amount || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
      });
      return;
    }
    
    const result = await sendTransaction(recipient, Number(amount));
    if (result) {
      setTransaction(result);
      
      toast({
        title: "Transaction Created",
        description: "QR code generated successfully. Share it with the recipient.",
      });
    }
  };
  
  const handleReceiveTransaction = (tx: TransactionData) => {
    console.log("Received transaction:", tx);
    setReceivedTransaction(tx);
    
    toast({
      title: "Transaction Received",
      description: `Received ${tx.amount} units from ${tx.sender.substring(0, 8)}...`,
    });
  };
  
  const clearTransaction = () => {
    setTransaction(null);
    setRecipient('');
    setAmount('');
  };
  
  const confirmReceivedTransaction = () => {
    setReceivedTransaction(null);
    navigate('/wallet?tab=received');
    
    toast({
      title: "Transaction Confirmed",
      description: "The transaction has been added to your wallet",
    });
  };
  
  if (!hasWallet()) {
    return (
      <>
        <Header />
        <div className="page-container justify-center items-center pb-20 md:pb-8">
          <div className="text-center max-w-md mx-auto animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <QrCode className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Wallet Required</h1>
            <p className="text-muted-foreground mb-8">
              You need to create a wallet before you can make transactions
            </p>
            <Button onClick={() => navigate('/authentication')} className="btn-shine">
              Create Wallet
            </Button>
          </div>
        </div>
        <NavBar />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="page-container pb-20 md:pb-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <QrCode className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Transaction</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Send or receive units using QR codes for secure offline transactions
          </p>
        </div>
        
        <Tabs 
          defaultValue="send" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="max-w-md mx-auto"
        >
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="send" className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              Send
            </TabsTrigger>
            <TabsTrigger value="receive" className="flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4" />
              Receive
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="animate-fade-in">
            {transaction ? (
              <div className="space-y-8">
                <QRGenerator transaction={transaction} />
                
                <div className="text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Share this QR code with the recipient to complete the transaction
                  </p>
                  <Button variant="outline" onClick={clearTransaction}>
                    Create Another Transaction
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ArrowUpRight className="h-5 w-5 mr-2 text-primary" />
                    Send Units
                  </CardTitle>
                  <CardDescription>
                    Create a new transaction to send units
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="recipient">
                      Recipient Address
                    </label>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient public key or address"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="amount">
                      Amount
                    </label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount to send"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full btn-shine" 
                    onClick={handleSend}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Generate Transaction QR'}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="receive" className="animate-fade-in">
            {receivedTransaction ? (
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-green-600">
                    <Check className="h-5 w-5 mr-2" />
                    Transaction Received
                  </CardTitle>
                  <CardDescription>
                    You've successfully received a transaction
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-lg font-semibold text-green-600">
                        {receivedTransaction.amount} Units
                      </span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">From:</span>
                      <span className="text-sm font-mono">
                        {receivedTransaction.sender.substring(0, 12)}...
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Transaction ID:</span>
                      <span className="text-sm font-mono">
                        {receivedTransaction.id.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={confirmReceivedTransaction}
                  >
                    Confirm & Save Transaction
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <QRScanner onScan={handleReceiveTransaction} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <NavBar />
    </>
  );
};

export default Transaction;
