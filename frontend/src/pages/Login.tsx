import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Logging in with', { email, password });
      await login({ email, password });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-x-hidden">
      <div className="w-[320px] sm:w-[400px]">
        <div className="glass-card hover-glow w-full rounded-lg p-4 sm:p-6 md:p-8 box-border">
          <div className="text-center mb-8">
            <h1 className="gradient-text text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your account</p>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="glass w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="glass w-full px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm text-gray-300 hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="glass hover-glow w-full py-3 px-4 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account? <a href="/signup" className="gradient-text">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
