
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanLine, Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransactionData } from '@/utils/cryptography';
import { QrReader } from 'react-qr-reader';
import { toast } from '@/components/ui/use-toast';

interface QRScannerProps {
  onScan: (transaction: TransactionData) => void;
  className?: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, className }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleScan = (result: string | null) => {
    if (!result) return;
    
    try {
      // Set processing state to show animation
      setIsProcessing(true);
      
      // Parse the QR code data
      const transactionData = JSON.parse(result) as TransactionData;
      
      // Validate the transaction data
      if (!transactionData.id || !transactionData.sender || 
          !transactionData.recipient || !transactionData.amount) {
        throw new Error("Invalid QR code data");
      }
      
      // Add a small delay to show the processing animation
      setTimeout(() => {
        // Process the transaction
        setIsScanning(false);
        setIsProcessing(false);
        onScan(transactionData);
      }, 1200);
      
    } catch (err) {
      setIsProcessing(false);
      setError("Invalid QR code format. Please try again.");
      
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "Could not read transaction data from QR code.",
      });
      
      // Reset error after a delay
      setTimeout(() => setError(null), 3000);
    }
  };
  
  const startScanning = () => {
    setIsScanning(true);
    setError(null);
  };
  
  const cancelScanning = () => {
    setIsScanning(false);
    setIsProcessing(false);
  };
  
  // Handle camera errors
  const handleCameraError = () => {
    console.error("Camera error occurred");
    setError("Camera access denied or error occurred.");
    setIsScanning(false);
    
    toast({
      variant: "destructive",
      title: "Camera Error",
      description: "Unable to access your camera. Please check permissions.",
    });
  };
  
  return (
    <Card className={cn("w-full overflow-hidden card-shadow", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <ScanLine className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Scan QR Code</CardTitle>
        </div>
        <CardDescription>
          Scan a transaction QR code to receive funds
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 pb-6">
        {isScanning ? (
          <div className="relative w-full aspect-square max-w-xs mx-auto bg-gray-900 rounded-lg overflow-hidden">
            {/* QR Scanner */}
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={(result) => {
                if (result) {
                  handleScan(result.getText());
                }
              }}
              scanDelay={500}
              className="w-full h-full"
              videoStyle={{ objectFit: 'cover' }}
              videoContainerStyle={{ 
                width: '100%', 
                height: '100%', 
                paddingTop: 0 
              }}
            />
            
            {/* Processing overlay (shows when QR is detected) */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 animate-fade-in">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white font-medium">Processing Transaction...</p>
              </div>
            )}
            
            {/* Overlay scan frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-primary/70 rounded-lg relative">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary"></div>
                
                {/* Scanning animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/70 animate-[scanline_2s_linear_infinite]"></div>
              </div>
            </div>
            
            {/* Add keyframes for scan line animation as a style block */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes scanline {
                  0% { transform: translateY(0); }
                  50% { transform: translateY(191px); }
                  100% { transform: translateY(0); }
                }
                
                @keyframes pulse-border {
                  0% { border-color: rgba(59, 130, 246, 0.5); }
                  50% { border-color: rgba(59, 130, 246, 0.8); }
                  100% { border-color: rgba(59, 130, 246, 0.5); }
                }
              `
            }} />
            
            {/* Cancel button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 bg-white/80 hover:bg-white"
              onClick={cancelScanning}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center hover-scale">
              <Camera className="h-8 w-8 text-secondary-foreground" />
            </div>
            
            {error ? (
              <div className="text-sm text-red-500 animate-fade-in">{error}</div>
            ) : (
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Press the button below to access your device's camera and scan a transaction QR code
              </p>
            )}
            
            <Button 
              className="mt-2 btn-shine relative overflow-hidden group" 
              onClick={startScanning}
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2">Start Scanning</span>
                <span className="h-4 w-4 rounded-full bg-white/20 absolute right-0 group-hover:scale-[15] transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-10"></span>
              </span>
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-secondary/20 px-4 py-3">
        <p className="text-xs text-muted-foreground w-full text-center">
          Position the QR code within the frame to scan automatically
        </p>
      </CardFooter>
    </Card>
  );
};

export default QRScanner;
