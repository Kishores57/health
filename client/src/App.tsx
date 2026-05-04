import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BookTest from "@/pages/BookTest";
import Reports from "@/pages/Reports";
import AboutUs from "@/pages/AboutUs";
import OwnerDashboard from "@/pages/OwnerDashboard";
import Login from "@/pages/Login";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <WhatsAppButton />
      <main className="flex-grow">
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/book" component={BookTest} />
          <Route path="/reports" component={Reports} />
          <Route path="/about" component={AboutUs} />

          {/* Owner Login — accessible via direct URL only, hidden from nav */}
          <Route path="/owner-login" component={Login} />

          {/* Owner Dashboard — protected on the page level */}
          <Route path="/owner" component={OwnerDashboard} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
