import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user?: User;
  session?: Session;
  error?: AuthError;
}

/**
 * Authentication Service
 * Handles all auth operations with proper error handling
 */
export const authService = {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        return {
          error: {
            message: this.getErrorMessage(error),
            status: error.status
          }
        };
      }

      return {
        user: data.user ?? undefined,
        session: data.session ?? undefined
      };
    } catch (error) {
      return {
        error: {
          message: "An unexpected error occurred during sign up"
        }
      };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          error: {
            message: this.getErrorMessage(error),
            status: error.status
          }
        };
      }

      return {
        user: data.user,
        session: data.session
      };
    } catch (error) {
      return {
        error: {
          message: "An unexpected error occurred during sign in"
        }
      };
    }
  },

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) {
        return {
          error: {
            message: this.getErrorMessage(error),
            status: error.status
          }
        };
      }

      // OAuth flow will redirect, so no immediate user/session
      return {};
    } catch (error) {
      return {
        error: {
          message: "An unexpected error occurred during Google sign in"
        }
      };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error?: AuthError }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          error: {
            message: this.getErrorMessage(error),
            status: error.status
          }
        };
      }

      return {};
    } catch (error) {
      return {
        error: {
          message: "An unexpected error occurred during sign out"
        }
      };
    }
  },

  /**
   * Get current session
   */
  async getSession(): Promise<{ session: Session | null; error?: AuthError }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          session: null,
          error: {
            message: this.getErrorMessage(error),
            status: error.status
          }
        };
      }

      return { session: data.session };
    } catch (error) {
      return {
        session: null,
        error: {
          message: "An unexpected error occurred getting session"
        }
      };
    }
  },

  /**
   * Helper to get user-friendly error messages
   */
  getErrorMessage(error: any): string {
    if (!error) return "An unknown error occurred";

    // Handle common Supabase error codes
    if (error.message?.includes("Invalid login credentials")) {
      return "Invalid email or password";
    }
    if (error.message?.includes("User already registered")) {
      return "An account with this email already exists";
    }
    if (error.message?.includes("Email not confirmed")) {
      return "Please verify your email before signing in";
    }
    if (error.message?.includes("Password should be at least")) {
      return "Password must be at least 6 characters";
    }

    return error.message || "An error occurred";
  }
};
