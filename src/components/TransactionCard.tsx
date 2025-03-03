
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Clock, Check } from 'lucide-react';
import { TransactionData } from '@/utils/cryptography';
import { cn } from '@/lib/utils';
import { useTransaction } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';

interface TransactionCardProps {
  transaction: TransactionData;
  type: 'sent' | 'received' | 'pending';
  className?: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  type,
  className 
}) => {
  const { confirmTransaction, state } = useTransaction();
  const { isLoading } = state;
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  const handleConfirmTransaction = () => {
    confirmTransaction(transaction.id);
  };
  
  return (
    <Card 
      className={cn(
        "w-full overflow-hidden transition-all duration-300 hover:card-shadow", 
        className,
        type === 'pending' && "border-primary/30 bg-primary/5",
      )}
    >
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          {type === 'sent' && (
            <div className="p-1.5 rounded-full bg-orange-100 text-orange-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          )}
          {type === 'received' && (
            <div className="p-1.5 rounded-full bg-green-100 text-green-600">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          )}
          {type === 'pending' && (
            <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
              <Clock className="h-4 w-4" />
            </div>
          )}
          <CardTitle className="text-sm font-medium">
            {type === 'sent' ? 'Sent' : type === 'received' ? 'Received' : 'Pending'}
          </CardTitle>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-sm font-semibold",
            type === 'sent' ? "text-orange-600" : 
            type === 'received' ? "text-green-600" : 
            "text-blue-600"
          )}>
            {type === 'sent' ? '-' : '+'}{transaction.amount} Units
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="px-4 py-2 text-xs">
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">Transaction ID:</span>
          <span className="font-mono">{transaction.id.substring(0, 8)}...</span>
        </div>
        
        <div className="flex justify-between mb-1">
          <span className="text-muted-foreground">
            {type === 'sent' ? 'Recipient:' : 'Sender:'}
          </span>
          <span className="font-mono">
            {type === 'sent' ? transaction.recipient.substring(0, 8) : transaction.sender.substring(0, 8)}...
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date:</span>
          <span>{formatDate(transaction.timestamp)}</span>
        </div>
      </CardContent>
      
      {type === 'pending' && (
        <CardFooter className="px-4 py-3 bg-secondary/10 flex justify-end">
          <Button 
            size="sm" 
            onClick={handleConfirmTransaction}
            disabled={isLoading}
            className="text-xs h-8"
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Confirm
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TransactionCard;
