import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../../assets/images/logo/logo_sma_11.png';

const LoginForm = ({
  onSubmit,
  loading = false,
  errorMessage = '',
  onSignupClick,
  onForgotPasswordClick,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username wajib diisi';
    }
    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.({ username, password });
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-2">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img
          src={logo}
          alt="Logo SMA"
          className="h-24 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Welcome!</h2>
        <p className="text-sm text-gray-500 mt-1">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSignupClick}
            className="text-blue-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* General Server Error Message */}
      {errorMessage ? (
        <div
          role="alert"
          className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium"
        >
          {errorMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} noValidate>
        {/* Username Input */}
        <div className="mb-4">
          <label htmlFor="login-username" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Username
          </label>
          <input
            id="login-username"
            name="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="isestar@gmail.com"
            autoComplete="username"
            disabled={loading}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            className={`w-full px-4 py-3 rounded-full border text-sm transition-all outline-none ${
              errors.username
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          />
          {errors.username ? (
            <p id="username-error" className="mt-1 text-xs text-red-500">
              {errors.username}
            </p>
          ) : null}
        </div>

        {/* Password Input */}
        <div className="mb-2">
          <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              data-testid="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`w-full pl-4 pr-12 py-3 rounded-full border text-sm transition-all outline-none ${
                errors.password
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-600 transition-colors rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Eye className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p id="password-error" className="mt-1 text-xs text-red-500">
              {errors.password}
            </p>
          ) : null}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-start mb-6">
          <button
            type="button"
            onClick={onForgotPasswordClick}
            className="px-2 py-2 -ml-2 text-xs text-blue-500 hover:text-blue-700 hover:underline rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
          >
            Forget password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading || undefined}
          className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20 border-0 transition-all text-sm disabled:pointer-events-none disabled:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
