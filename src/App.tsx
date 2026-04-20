import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index.tsx";
import RoleChooser from "./pages/RoleChooser.tsx";
import StudentAuth from "./pages/StudentAuth.tsx";
import TeacherAuth from "./pages/TeacherAuth.tsx";
import TeacherDashboard from "./pages/TeacherDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import AIChatbot from "./components/AIChatbot.tsx";

const queryClient = new QueryClient();

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}

function AppRoutes() {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (authLoading) return <Loader />;

  // Logged-out routes
  if (!user) {
    return (
      <Routes>
        <Route path="/student/auth" element={<StudentAuth />} />
        <Route path="/teacher/auth" element={<TeacherAuth />} />
        <Route path="/" element={<RoleChooser />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (roleLoading) return <Loader />;

  // Logged-in routes — route by role
  return (
    <Routes>
      <Route
        path="/"
        element={role === "teacher" ? <TeacherDashboard /> : <Index />}
      />
      <Route path="/student/auth" element={<Navigate to="/" replace />} />
      <Route path="/teacher/auth" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <AIChatbot />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
