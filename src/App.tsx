
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppRouter } from "@/router";
import { Toaster } from "@/components/ui/sonner";
import { useSession, useAuthEventListener } from "@/hooks";
import { hasTokens } from "@/services/api/client";
import { setLoading } from "@/app/store/authSlice";
import { useAppDispatch } from "@/app/store/store";

// ============================================
// AUTH INITIALIZER - Checks session on mount
// ============================================

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isLoading, refetch } = useSession();
  
  // Listen for global auth events (logout, forbidden, etc.)
  useAuthEventListener();

  // Initialize auth state on mount
  useEffect(() => {
    if (hasTokens()) {
      refetch();
    } else {
      dispatch(setLoading(false));
    }
  }, [refetch, dispatch]);

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

// ============================================
// APP COMPONENT
// ============================================

function App() {
  return (
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider>
          <AuthInitializer>
            <AppRouter />
          </AuthInitializer>
          <Toaster />
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  );
}

export default App;