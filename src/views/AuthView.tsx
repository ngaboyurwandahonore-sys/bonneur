import React, { useState } from 'react';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { AuthService } from '../services/authService';

interface AuthViewProps {
  mode: 'signin' | 'signup';
  onAuthenticate: (userData: any) => void;
}

export function AuthView({ mode, onAuthenticate }: AuthViewProps) {
  const [currentMode, setCurrentMode] = useState(mode);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await AuthService.signIn(email, password);
      if (result) {
        onAuthenticate(result.user);
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('An error occurred during sign in');
    }
  };

  const handleSignUp = async (userData: any) => {
    try {
      const result = await AuthService.signUp(userData);
      onAuthenticate(result.user);
    } catch (error) {
      console.error('Sign up error:', error);
      alert('An error occurred during sign up');
    }
  };

  if (currentMode === 'signin') {
    return (
      <SignInForm
        onSignIn={handleSignIn}
        onSwitchToSignUp={() => setCurrentMode('signup')}
      />
    );
  }

  return (
    <SignUpForm
      onSignUp={handleSignUp}
      onSwitchToSignIn={() => setCurrentMode('signin')}
    />
  );
}