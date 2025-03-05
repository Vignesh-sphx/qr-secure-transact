
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
import { ArrowUpRight, ArrowDownLeft, QrCode, Check, Mail } from 'lucide-react';
import { TransactionData } from '@/utils/cryptography';
import { useTransaction } from '@/context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Transaction: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state, sendTransaction, receiveTransaction, hasWallet } = useTransaction();
  const { isLoading } = state;
  
  const initialTab = searchParams.get('tab') === 'receive' ? 'receive' : 'send';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  
  const [receivedTransaction, setReceivedTransaction] = useState<TransactionData | null>(null);
  const [receiveAnimationActive, setReceiveAnimationActive] = useState(false);
  
  useEffect(() => {
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
    
    setIsGeneratingQR(true);
    setTransactionProcessing(true);
    
    // Add animation timing
    setTimeout(async () => {
      const result = await sendTransaction(recipient, Number(amount));
      setIsGeneratingQR(false);
      
      if (result) {
        setTransaction(result);
        
        toast({
          title: "Transaction Created",
          description: "QR code generated successfully. Share it with the recipient.",
        });
      }
      
      setTimeout(() => {
        setTransactionProcessing(false);
      }, 500);
    }, 1000);
  };
  
  const handleReceiveTransaction = async (tx: TransactionData) => {
    console.log("Received transaction:", tx);
    setReceiveAnimationActive(true);
    
    // Delay to show animation
    setTimeout(async () => {
      setReceivedTransaction(tx);
      await receiveTransaction(tx);
      
      toast({
        title: "Transaction Received",
        description: `Received ${tx.amount} units from ${tx.sender.substring(0, 8)}...`,
      });
      
      setTimeout(() => {
        setReceiveAnimationActive(false);
      }, 500);
    }, 1000);
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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 animate-float">
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
              <div className="space-y-8 animate-scale-in">
                <div className="relative">
                  <QRGenerator transaction={transaction} />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full animate-pulse">
                    <Mail size={16} />
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Share this QR code with the recipient to complete the transaction.
                    A notification email has been sent.
                  </p>
                  <Button variant="outline" onClick={clearTransaction} className="hover-scale">
                    Create Another Transaction
                  </Button>
                </div>
              </div>
            ) : (
              <Card className={`card-shadow overflow-hidden ${transactionProcessing ? 'animate-pulse-soft' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ArrowUpRight className="h-5 w-5 mr-2 text-primary" />
                    Send Units
                  </CardTitle>
                  <CardDescription>
                    Create a new transaction to send units
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 relative">
                  {isGeneratingQR && (
                    <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-fade-in">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm font-medium">Generating Transaction...</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="recipient">
                      Recipient Address
                    </label>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient public key or address"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
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
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full btn-shine relative overflow-hidden group" 
                    onClick={handleSend}
                    disabled={isLoading || isGeneratingQR}
                  >
                    <span className="relative z-10 flex items-center">
                      {isLoading || isGeneratingQR ? 'Processing...' : 'Generate Transaction QR'}
                      <span className="h-4 w-4 rounded-full bg-white/20 absolute right-0 group-hover:scale-[15] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-10"></span>
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="receive" className="animate-fade-in">
            {receivedTransaction ? (
              <Card className="card-shadow animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-green-600">
                    <Check className="h-5 w-5 mr-2" />
                    Transaction Received
                    <div className="ml-2 bg-green-500 text-white p-1 rounded-full animate-pulse">
                      <Mail size={16} />
                    </div>
                  </CardTitle>
                  <CardDescription>
                    You've successfully received a transaction.
                    A notification email has been sent.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="text-lg font-semibold text-green-600 animate-[pulse_2s_ease-in-out_1]">
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
                    className="w-full hover-scale animate-shimmer bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700" 
                    onClick={confirmReceivedTransaction}
                  >
                    Confirm & Save Transaction
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className={`relative ${receiveAnimationActive ? 'animate-pulse' : ''}`}>
                <QRScanner onScan={handleReceiveTransaction} />
                {receiveAnimationActive && (
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center rounded-lg">
                    <div className="bg-card p-4 rounded-lg shadow-lg animate-fade-in">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm font-medium text-center">Processing Transaction...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <NavBar />
    </>
  );
};

export default Transaction;
