
import React, { useState } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage: React.FC = () => {
  const { isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<string>("sign-in");

  // Redirect if already signed in
  if (isSignedIn) {
    return <Navigate to="/authentication" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <QrCode className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">SecureTransact</h1>
        </div>
        <p className="text-muted-foreground max-w-md">
          Sign in or create an account to access your secure wallet and transactions
        </p>
      </div>

      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="mt-2">
            <div className="bg-card rounded-lg border shadow-sm p-2">
              <SignIn 
                routing="path" 
                path="/auth"
                signUpUrl="/auth"
                afterSignInUrl="/authentication"
              />
            </div>
          </TabsContent>
          <TabsContent value="sign-up" className="mt-2">
            <div className="bg-card rounded-lg border shadow-sm p-2">
              <SignUp 
                routing="path" 
                path="/auth"
                signInUrl="/auth"
                afterSignUpUrl="/authentication"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
