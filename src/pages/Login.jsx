import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import Spinner from "../components/common/Spinner";

/**
 * Login Page - demonstration authentication.
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 3) {
      setError("Password must be at least 3 characters");
      return;
    }


    setIsLoading(true);

    // Authenticate
    setTimeout(() => {
      dispatch(login({ token: "fake-jwt-token-12345" }));
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-br from-primary-container via-surface to-tertiary-container animate-fade-in">
      <div className="w-full max-w-md p-8 bg-surface/80 backdrop-blur-xl rounded-3xl shadow-elevation-3 border border-outline-variant/20 transform transition-all hover:scale-[1.01] duration-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            NERV Admin
          </h1>
          <h2 className="text-on-surface-variant font-medium">
            Welcome back, Commander
          </h2>
        </div>

        {error && (
          <div
            className="mb-6 p-4 bg-error-container/50 text-error rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2"
            role="alert"
          >
            <span>⚠️</span>
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-bold text-on-surface ml-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="shinji@nerv.com"
              autoComplete="email"
              disabled={isLoading}
              className="w-full px-5 py-3.5 rounded-xl bg-surface-variant/30 border-2 border-transparent focus:bg-surface focus:border-primary transition-all outline-none font-medium placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-on-surface ml-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full px-5 py-3.5 rounded-xl bg-surface-variant/30 border-2 border-transparent focus:bg-surface focus:border-primary transition-all outline-none font-medium placeholder:text-on-surface-variant/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-on-primary rounded-full font-bold text-lg shadow-elevation-2 hover:shadow-elevation-4 hover:bg-primary-dark transition-all active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            disabled={isLoading}
          >
            <span
              className={`relative z-10 flex items-center justify-center gap-2 ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              Login ➜
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner
                  size="md"
                  color="border-on-primary border-t-transparent"
                />
              </div>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-on-surface-variant">
          Hint: Use any email and password to login
        </p>
      </div>
    </div>
  );
};

export default Login;
