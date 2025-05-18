import { useContext, useState } from 'react';
import { login } from '@/feature/authentication/service/auth';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { FaBookOpen, FaEnvelope, FaLock } from 'react-icons/fa';
import { AppContext } from '@/context/AppContext';
import LoadingOverlay from '../../../core/components/ui/loading_screen';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });
      setToken(response.data.access_token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError('Email atau password salah');
      } else {
        setError('Terjadi kesalahan sistem');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full bg-white shadow-md rounded-lg flex overflow-hidden">
      {/* Left Side */}
      {loading &&
        <LoadingOverlay
        />}
      <div className="w-1/2 bg-[#0f172a] text-white flex flex-col items-center justify-center p-8">
        <FaBookOpen className="text-5xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">Djabbar.co</h2>
        <p className="text-sm text-center">
          Access your dashboard to manage management data efficiently and
          securely
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to continue to your dashboard
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="your@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaLock />
              </span>
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>
          </div>

          {/* Remember me & forgot */}
          <div className="flex justify-between items-center mb-2 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            {/* <a href="#" className="text-blue-500 hover:underline">
                Forgot password?
              </a> */}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1 mb-5">{error}</p>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                Signing in...
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
