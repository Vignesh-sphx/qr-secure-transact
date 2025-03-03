
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TransactionData } from '@/utils/cryptography';

interface QRGeneratorProps {
  transaction: TransactionData | null;
  className?: string;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ transaction, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = React.useState(false);
  
  useEffect(() => {
    if (!transaction || !canvasRef.current) return;
    
    // This would normally use a QR code library
    // For this demo, we'll simulate generating a QR code with canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate a simple placeholder QR code
    const cellSize = 10;
    const margin = 40;
    const size = canvas.width - (margin * 2);
    
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw QR code cells (simplified pattern for demo)
    ctx.fillStyle = '#000000';
    
    // Create a deterministic pattern based on transaction ID
    const seed = transaction.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let y = 0; y < size / cellSize; y++) {
      for (let x = 0; x < size / cellSize; x++) {
        // Deterministic pattern based on transaction details
        const shouldFill = (
          (x * y + seed) % 3 === 0 || 
          (x === 3 || y === 3 || x === size / cellSize - 4 || y === size / cellSize - 4) ||
          (x >= 3 && x <= 5 && y >= 3 && y <= 5) ||
          (x >= size / cellSize - 6 && x <= size / cellSize - 4 && y >= 3 && y <= 5) ||
          (x >= 3 && x <= 5 && y >= size / cellSize - 6 && y <= size / cellSize - 4)
        );
        
        if (shouldFill) {
          ctx.fillRect(
            margin + x * cellSize, 
            margin + y * cellSize, 
            cellSize, 
            cellSize
          );
        }
      }
    }
    
    // Add transaction amount in the center
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 20, 100, 40);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${transaction.amount}`, canvas.width / 2, canvas.height / 2);
    
  }, [transaction]);
  
  const downloadQRCode = () => {
    if (!canvasRef.current || !transaction) return;
    
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = image;
    link.download = `transaction-${transaction.id.substring(0, 8)}.png`;
    link.click();
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };
  
  if (!transaction) {
    return null;
  }
  
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
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="rounded"
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
