
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// For Vite, Clerk environment variables need to start with VITE_
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
  // Don't throw an error as it would break the preview completely
  // Instead, we'll show an error in the console and continue
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY || "placeholder_key_for_preview"}>
    <App />
  </ClerkProvider>
);
