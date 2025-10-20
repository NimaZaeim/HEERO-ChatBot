// In this file we import the necessary components and libraries to set up our React application.
// We use React Router for routing, TanStack Query for data fetching, and custom UI components for notifications and tooltips.

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient(); 

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} /> 
          <Route path="*" element={<NotFound />} />
          {/* Here you can add other custom routes (pages)*/}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
