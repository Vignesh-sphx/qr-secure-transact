import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  TransactionData, 
  Wallet,
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey
} from '@/utils/cryptography';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/clerk-react';

// Define the state type
interface TransactionState {
  wallet: Wallet | null;
  transactions: TransactionData[];
  pendingTransactions: TransactionData[];
  isLoading: boolean;
  error: string | null;
}

// Define action types
type TransactionAction =
  | { type: 'SET_WALLET'; payload: Wallet }
  | { type: 'ADD_TRANSACTION'; payload: TransactionData }
  | { type: 'ADD_PENDING_TRANSACTION'; payload: TransactionData }
  | { type: 'CONFIRM_TRANSACTION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_BALANCE'; payload: number }
  | { type: 'CLEAR_WALLET' };

// Initial state
const initialState: TransactionState = {
  wallet: null,
  transactions: [],
  pendingTransactions: [],
  isLoading: false,
  error: null,
};

// Create the context
const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
  createWallet: () => Promise<void>;
  sendTransaction: (recipient: string, amount: number) => Promise<TransactionData | null>;
  confirmTransaction: (transactionId: string) => Promise<void>;
  receiveTransaction: (transaction: TransactionData) => Promise<void>;
  hasWallet: () => boolean;
} | undefined>(undefined);

// Create a reducer to handle state updates
const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
  switch (action.type) {
    case 'SET_WALLET':
      return {
        ...state,
        wallet: action.payload,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'ADD_PENDING_TRANSACTION':
      return {
        ...state,
        pendingTransactions: [action.payload, ...state.pendingTransactions],
      };
    case 'CONFIRM_TRANSACTION': {
      const transactionId = action.payload;
      const pendingTx = state.pendingTransactions.find(tx => tx.id === transactionId);
      
      if (!pendingTx) return state;
      
      return {
        ...state,
        pendingTransactions: state.pendingTransactions.filter(tx => tx.id !== transactionId),
        transactions: [pendingTx, ...state.transactions],
      };
    }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        wallet: state.wallet ? { ...state.wallet, balance: action.payload } : null,
      };
    case 'CLEAR_WALLET':
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// Create the provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { user, isSignedIn } = useUser();

  // Load the wallet from localStorage on mount or when user changes
  useEffect(() => {
    const loadWallet = async () => {
      if (!isSignedIn || !user) {
        dispatch({ type: 'CLEAR_WALLET' });
        return;
      }
      
      try {
        // Use user ID as part of the storage key to isolate wallets per user
        const walletKey = `secure_wallet_${user.id}`;
        const walletData = localStorage.getItem(walletKey);
        
        if (walletData) {
          const wallet = JSON.parse(walletData) as Wallet;
          dispatch({ type: 'SET_WALLET', payload: wallet });
          
          // Also load transactions
          const txKey = `secure_transactions_${user.id}`;
          const transactionsData = localStorage.getItem(txKey);
          if (transactionsData) {
            const transactions = JSON.parse(transactionsData) as TransactionData[];
            transactions.forEach(tx => {
              dispatch({ type: 'ADD_TRANSACTION', payload: tx });
            });
          }
        }
      } catch (error) {
        console.error('Failed to load wallet from storage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load wallet' });
      }
    };

    loadWallet();
  }, [user, isSignedIn]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (isSignedIn && user && state.transactions.length > 0) {
      const txKey = `secure_transactions_${user.id}`;
      localStorage.setItem(txKey, JSON.stringify(state.transactions));
    }
  }, [state.transactions, user, isSignedIn]);

  // Function to send email notification
  const sendEmailNotification = async (transactionType: 'sent' | 'received', transaction: TransactionData) => {
    if (!user?.emailAddresses || user.emailAddresses.length === 0) {
      console.log('No email address available to send notification');
      return;
    }
    
    try {
      const userEmail = user.emailAddresses[0].emailAddress;
      
      // This is a serverless function to send email - in a real app, you'd implement this
      // For demo purposes, we'll just log the email that would be sent
      console.log(`Email would be sent to ${userEmail}`);
      console.log(`Subject: Transaction ${transactionType === 'sent' ? 'Sent' : 'Received'}`);
      console.log(`Body: You have ${transactionType} ${transaction.amount} units. Transaction ID: ${transaction.id}`);
      
      // In a real implementation, you would call your backend API or serverless function here
      // const response = await fetch('https://your-api.com/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: userEmail,
      //     subject: `Transaction ${transactionType === 'sent' ? 'Sent' : 'Received'}`,
      //     message: `You have ${transactionType} ${transaction.amount} units. Transaction ID: ${transaction.id}`
      //   })
      // });
      
      console.log('Email notification would be sent successfully');
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

  // Create a new wallet
  const createWallet = async () => {
    if (!isSignedIn || !user) {
      dispatch({ type: 'SET_ERROR', payload: 'You must be signed in to create a wallet' });
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to create a wallet.",
      });
      return;
    }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Generate a new key pair
      const keyPair = await generateKeyPair();
      
      // Export the keys to storable format
      const publicKeyString = await exportPublicKey(keyPair.publicKey);
      const privateKeyString = await exportPrivateKey(keyPair.privateKey);
      
      // Create the wallet object
      const wallet: Wallet = {
        publicKey: publicKeyString,
        privateKey: privateKeyString,
        balance: 1000, // Starting balance for demo
        transactions: [],
      };
      
      // Save to state and localStorage (with user ID in the key)
      dispatch({ type: 'SET_WALLET', payload: wallet });
      localStorage.setItem(`secure_wallet_${user.id}`, JSON.stringify(wallet));
      
      toast({
        title: "Wallet created",
        description: "Your digital wallet has been created successfully",
      });
    } catch (error) {
      console.error('Wallet creation failed:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Wallet creation failed' 
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create wallet. Please try again.",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Send a transaction (this is a simplified demo)
  const sendTransaction = async (recipient: string, amount: number): Promise<TransactionData | null> => {
    if (!isSignedIn || !user) {
      dispatch({ type: 'SET_ERROR', payload: 'You must be signed in to send transactions' });
      return null;
    }
    
    if (!state.wallet) {
      dispatch({ type: 'SET_ERROR', payload: 'No wallet found' });
      return null;
    }

    if (amount <= 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Amount must be greater than 0' });
      return null;
    }

    if (amount > state.wallet.balance) {
      dispatch({ type: 'SET_ERROR', payload: 'Insufficient balance' });
      return null;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      // In a real app, you would use the cryptography functions to sign the transaction
      // This is simplified for demo purposes
      const transactionData: TransactionData = {
        id: `tx_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`,
        sender: state.wallet.publicKey.slice(0, 20) + '...', // Abbreviated for display
        recipient,
        amount,
        timestamp: Date.now(),
        signature: 'demo_signature', // In a real app, this would be a cryptographic signature
      };
      
      // Update the wallet balance
      const newBalance = state.wallet.balance - amount;
      dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
      
      // Update local storage wallet data
      const updatedWallet = { ...state.wallet, balance: newBalance };
      localStorage.setItem(`secure_wallet_${user.id}`, JSON.stringify(updatedWallet));
      
      // Add to pending transactions
      dispatch({ type: 'ADD_PENDING_TRANSACTION', payload: transactionData });
      
      // Send email notification for transaction sent
      await sendEmailNotification('sent', transactionData);
      
      toast({
        title: "Transaction created",
        description: `Transaction of ${amount} units created successfully`,
      });
      
      return transactionData;
    } catch (error) {
      console.error('Transaction failed:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Transaction failed' 
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create transaction. Please try again.",
      });
      
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Confirm a transaction (simulate blockchain confirmation)
  const confirmTransaction = async (transactionId: string) => {
    if (!isSignedIn) {
      dispatch({ type: 'SET_ERROR', payload: 'You must be signed in to confirm transactions' });
      return;
    }
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Find the pending transaction
      const pendingTx = state.pendingTransactions.find(tx => tx.id === transactionId);
      if (!pendingTx) {
        dispatch({ type: 'SET_ERROR', payload: 'Transaction not found' });
        return;
      }
      
      // In a real app, this would involve communicating with a blockchain
      // For demo, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch({ type: 'CONFIRM_TRANSACTION', payload: transactionId });
      
      // Send email notification for confirmed transaction
      await sendEmailNotification('sent', pendingTx);
      
      toast({
        title: "Transaction confirmed",
        description: "Transaction has been verified and added to the blockchain",
      });
    } catch (error) {
      console.error('Transaction confirmation failed:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Transaction confirmation failed' 
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to confirm transaction.",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Receive a transaction
  const receiveTransaction = async (transaction: TransactionData) => {
    if (!isSignedIn || !user) {
      dispatch({ type: 'SET_ERROR', payload: 'You must be signed in to receive transactions' });
      return;
    }
    
    if (!state.wallet) {
      dispatch({ type: 'SET_ERROR', payload: 'No wallet found' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Update the receiver's wallet balance
      const newBalance = state.wallet.balance + transaction.amount;
      dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
      
      // Update local storage wallet data
      const updatedWallet = { ...state.wallet, balance: newBalance };
      localStorage.setItem(`secure_wallet_${user.id}`, JSON.stringify(updatedWallet));
      
      // Add to transactions
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      
      // Send email notification for received transaction
      await sendEmailNotification('received', transaction);
      
      toast({
        title: "Transaction received",
        description: `You received ${transaction.amount} units from ${transaction.sender.substring(0, 8)}...`,
      });
    } catch (error) {
      console.error('Transaction receiving failed:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Transaction receiving failed' 
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to receive transaction. Please try again.",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Check if user has a wallet
  const hasWallet = (): boolean => {
    return state.wallet !== null;
  };

  return (
    <TransactionContext.Provider
      value={{
        state,
        dispatch,
        createWallet,
        sendTransaction,
        confirmTransaction,
        receiveTransaction,
        hasWallet,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the transaction context
export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};
