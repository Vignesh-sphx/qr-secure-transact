
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import TransactionCard from '@/components/TransactionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownLeft, Clock, Wallet as WalletIcon } from 'lucide-react';
import { useTransaction } from '@/context/TransactionContext';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const { state, hasWallet } = useTransaction();
  const { wallet, transactions, pendingTransactions } = state;
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBalanceVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!hasWallet()) {
    return (
      <>
        <Header />
        <div className="page-container justify-center items-center pb-20 md:pb-8">
          <div className="text-center max-w-md mx-auto animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <WalletIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">No Wallet Found</h1>
            <p className="text-muted-foreground mb-8">
              You need to create a wallet before you can view transactions
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
            <WalletIcon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            View your balance and transaction history
          </p>
        </div>
        
        {/* Balance Card with enhanced styling and animations */}
        <Card className="mb-8 overflow-hidden card-shadow hover-scale transition-all-smooth">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 py-6">
            <CardTitle className="text-center">Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div 
              className={`text-4xl font-bold mb-2 transition-all duration-500 ${
                isBalanceVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform -translate-y-4'
              }`}
            >
              {wallet?.balance} Units
            </div>
            <p className="text-muted-foreground text-sm">Available for transactions</p>
            
            <div className="flex gap-3 mt-6">
              <Button 
                size="sm" 
                className="flex items-center transition-all hover:scale-105"
                onClick={() => navigate('/transaction')}
              >
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Send
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center transition-all hover:scale-105"
                onClick={() => navigate('/transaction?tab=receive')}
              >
                <ArrowDownLeft className="h-4 w-4 mr-1" />
                Receive
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Transactions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {pendingTransactions.length === 0 && transactions.length === 0 ? (
                <EmptyTransactionState />
              ) : (
                <>
                  {pendingTransactions.map(tx => (
                    <TransactionCard 
                      key={tx.id} 
                      transaction={tx} 
                      type="pending" 
                    />
                  ))}
                  
                  {transactions.map(tx => (
                    <TransactionCard 
                      key={tx.id} 
                      transaction={tx} 
                      type={tx.sender.includes('...') ? 'sent' : 'received'} 
                    />
                  ))}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="sent" className="space-y-4">
              {transactions.filter(tx => tx.sender.includes('...')).length === 0 ? (
                <EmptyTransactionState type="sent" />
              ) : (
                transactions
                  .filter(tx => tx.sender.includes('...'))
                  .map(tx => (
                    <TransactionCard key={tx.id} transaction={tx} type="sent" />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="received" className="space-y-4">
              {transactions.filter(tx => !tx.sender.includes('...')).length === 0 ? (
                <EmptyTransactionState type="received" />
              ) : (
                transactions
                  .filter(tx => !tx.sender.includes('...'))
                  .map(tx => (
                    <TransactionCard key={tx.id} transaction={tx} type="received" />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {pendingTransactions.length === 0 ? (
                <EmptyTransactionState type="pending" />
              ) : (
                pendingTransactions.map(tx => (
                  <TransactionCard key={tx.id} transaction={tx} type="pending" />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <NavBar />
    </>
  );
};

interface EmptyTransactionStateProps {
  type?: 'sent' | 'received' | 'pending';
}

const EmptyTransactionState: React.FC<EmptyTransactionStateProps> = ({ type }) => {
  const navigate = useNavigate();
  
  let icon = <Clock className="h-8 w-8 text-muted-foreground" />;
  let title = 'No Transactions Yet';
  let description = 'Your transaction history will appear here';
  let buttonText = 'Start a Transaction';
  let buttonAction = () => navigate('/transaction');
  
  if (type === 'sent') {
    icon = <ArrowUpRight className="h-8 w-8 text-muted-foreground" />;
    title = 'No Sent Transactions';
    description = 'You haven\'t sent any transactions yet';
    buttonText = 'Send Units';
  } else if (type === 'received') {
    icon = <ArrowDownLeft className="h-8 w-8 text-muted-foreground" />;
    title = 'No Received Transactions';
    description = 'You haven\'t received any transactions yet';
    buttonText = 'Receive Units';
    buttonAction = () => navigate('/transaction?tab=receive');
  } else if (type === 'pending') {
    icon = <Clock className="h-8 w-8 text-muted-foreground" />;
    title = 'No Pending Transactions';
    description = 'You don\'t have any pending transactions';
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-secondary/20 rounded-lg animate-fade-in">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      {type !== 'pending' && (
        <Button size="sm" onClick={buttonAction}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default Wallet;
