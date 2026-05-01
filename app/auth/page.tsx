'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp && !name.trim()) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        name: isSignUp ? name : undefined,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Try: demo@netflix.com / demo123');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  const fillDemo = () => {
    setEmail('demo@netflix.com');
    setPassword('demo123');
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e4-1d09714c1f44/a9b2ae16-a93c-4b9d-971c-7a1f2d8f0ccb/US-en-20231009-popsignuptwoweeks-perspective_alpha_website_large.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Netflix Logo */}
      <div className="absolute top-8 left-8">
        <span className="text-red-600 font-black text-3xl tracking-tighter">NETFLIXCLONE</span>
      </div>

      {/* Form Card */}
      <div className="relative z-10 bg-black/80 backdrop-blur-sm rounded-lg p-8 md:p-12 w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {isSignUp ? 'Create your account to get started.' : 'Sign in to continue watching.'}
        </p>

        {/* Demo Credentials Banner */}
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-6">
          <p className="text-blue-300 text-xs font-medium mb-1">🎬 Demo Credentials</p>
          <p className="text-blue-200 text-xs">Email: demo@netflix.com</p>
          <p className="text-blue-200 text-xs">Password: demo123</p>
          <button onClick={fillDemo} className="text-blue-400 text-xs underline mt-1 hover:text-blue-300">
            Auto-fill demo credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-700/80 text-white placeholder-gray-400 px-4 py-3.5 rounded focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-700/80 text-white placeholder-gray-400 px-4 py-3.5 rounded focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-700/80 text-white placeholder-gray-400 px-4 py-3.5 rounded focus:outline-none focus:ring-2 focus:ring-white/30 text-sm pr-12"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          {error && (
            <div className="bg-orange-500/20 border border-orange-500/50 rounded p-3">
              <p className="text-orange-300 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-zinc-600" />
          <span className="text-gray-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-zinc-600" />
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded transition-colors text-sm font-medium mb-6"
        >
          <FaGoogle size={16} />
          Continue with Google
        </button>

        {/* Toggle */}
        <div className="text-center">
          <span className="text-gray-400 text-sm">
            {isSignUp ? 'Already have an account? ' : 'New to Netflix Clone? '}
          </span>
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-white font-semibold text-sm hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign up now'}
          </button>
        </div>

        <p className="text-gray-600 text-xs mt-6 text-center">
          This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.
        </p>
      </div>
    </div>
  );
}
