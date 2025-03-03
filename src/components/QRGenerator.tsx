
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransactionData } from '@/utils/cryptography';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  transaction: TransactionData | null;
  className?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ transaction, className }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [downloaded, setDownloaded] = useState(false);
  
  const downloadQRCode = () => {
    if (!qrRef.current || !transaction) return;
    
    // Get the SVG element
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set dimensions
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      // Convert to PNG and download
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `transaction-${transaction.id.substring(0, 8)}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
  
  if (!transaction) {
    return null;
  }
  
  // Prepare transaction data for QR code
  const qrData = JSON.stringify({
    id: transaction.id,
    sender: transaction.sender,
    recipient: transaction.recipient,
    amount: transaction.amount,
    timestamp: transaction.timestamp,
    signature: transaction.signature
  });
  
  return (
    <Card className={cn("w-full overflow-hidden card-shadow", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <QrCode className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Transaction QR Code</CardTitle>
        </div>
        <CardDescription>
          Share this code with the recipient to complete the transaction
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex justify-center pt-0 pb-6">
        <div className="bg-white rounded-lg p-2 shadow-sm" ref={qrRef}>
          <QRCodeSVG
            value={qrData}
            size={300}
            level="H" // High error correction
            includeMargin={true}
            imageSettings={{
              src: '/placeholder.svg',
              x: undefined,
              y: undefined,
              height: 32,
              width: 32,
              excavate: true,
            }}
          />
        </div>
      </CardContent>
      
      <CardFooter className="bg-secondary/20 px-4 py-3 flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground">
          {`ID: ${transaction.id.substring(0, 8)}...`}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1"
          onClick={downloadQRCode}
        >
          {downloaded ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span>Downloaded</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRGenerator;
