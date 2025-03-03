
/**
 * Cryptography utility functions for secure transactions
 * This file handles key generation, signing, and verification
 */

// Generate a cryptographic key pair
export const generateKeyPair = async (): Promise<CryptoKeyPair> => {
  try {
    return await window.crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true, // extractable
      ['sign', 'verify'] // key usages
    );
  } catch (error) {
    console.error('Failed to generate key pair:', error);
    throw new Error('Key generation failed. Please try again.');
  }
};

// Export public key to a transferable format
export const exportPublicKey = async (publicKey: CryptoKey): Promise<string> => {
  try {
    const exported = await window.crypto.subtle.exportKey('spki', publicKey);
    return arrayBufferToBase64(exported);
  } catch (error) {
    console.error('Failed to export public key:', error);
    throw new Error('Public key export failed');
  }
};

// Export private key to a transferable format (only for secure storage)
export const exportPrivateKey = async (privateKey: CryptoKey): Promise<string> => {
  try {
    const exported = await window.crypto.subtle.exportKey('pkcs8', privateKey);
    return arrayBufferToBase64(exported);
  } catch (error) {
    console.error('Failed to export private key:', error);
    throw new Error('Private key export failed');
  }
};

// Import public key from stored format
export const importPublicKey = async (publicKeyString: string): Promise<CryptoKey> => {
  try {
    const keyData = base64ToArrayBuffer(publicKeyString);
    return await window.crypto.subtle.importKey(
      'spki',
      keyData,
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['verify']
    );
  } catch (error) {
    console.error('Failed to import public key:', error);
    throw new Error('Public key import failed');
  }
};

// Import private key from stored format
export const importPrivateKey = async (privateKeyString: string): Promise<CryptoKey> => {
  try {
    const keyData = base64ToArrayBuffer(privateKeyString);
    return await window.crypto.subtle.importKey(
      'pkcs8',
      keyData,
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['sign']
    );
  } catch (error) {
    console.error('Failed to import private key:', error);
    throw new Error('Private key import failed');
  }
};

// Sign transaction data with a private key
export const signData = async (data: any, privateKey: CryptoKey): Promise<string> => {
  try {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const signature = await window.crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' },
      },
      privateKey,
      encodedData
    );
    
    return arrayBufferToBase64(signature);
  } catch (error) {
    console.error('Failed to sign data:', error);
    throw new Error('Transaction signing failed');
  }
};

// Verify the signature of transaction data
export const verifySignature = async (
  data: any,
  signature: string,
  publicKey: CryptoKey
): Promise<boolean> => {
  try {
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const signatureBuffer = base64ToArrayBuffer(signature);
    
    return await window.crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' },
      },
      publicKey,
      signatureBuffer,
      encodedData
    );
  } catch (error) {
    console.error('Failed to verify signature:', error);
    return false;
  }
};

// Create a transaction object
export const createTransaction = async (
  sender: string,
  recipient: string,
  amount: number,
  privateKey: CryptoKey
): Promise<TransactionData> => {
  const timestamp = Date.now();
  const transactionId = generateTransactionId(sender, recipient, amount, timestamp);
  
  const transactionData: TransactionData = {
    id: transactionId,
    sender,
    recipient,
    amount,
    timestamp,
  };
  
  // Sign the transaction
  const signature = await signData(transactionData, privateKey);
  
  return {
    ...transactionData,
    signature,
  };
};

// Helper function to generate a transaction ID
export const generateTransactionId = (
  sender: string,
  recipient: string,
  amount: number,
  timestamp: number
): string => {
  const data = `${sender}:${recipient}:${amount}:${timestamp}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  // Create a hash of the transaction data
  const hashBuffer = Array.from(new Uint8Array(dataBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return hashBuffer.slice(0, 32); // Return first 32 chars as the ID
};

// Helper utility to convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Helper utility to convert Base64 string to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Types
export interface TransactionData {
  id: string;
  sender: string;
  recipient: string;
  amount: number;
  timestamp: number;
  signature?: string;
}

export interface Wallet {
  publicKey: string;
  privateKey: string;
  balance: number;
  transactions: TransactionData[];
}
