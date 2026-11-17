import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { selectTheme } from "../store/selectors";
import Spinner from "../components/common/Spinner";

/**
 * Login Page - demonstration authentication.
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useSelector(selectTheme);
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-surface-container-low transition-colors duration-200">
      <div
        className={`w-full max-w-md p-8 bg-surface border transition-all duration-300 ${
          theme === "magi"
            ? "magi-hex-card border-2 border-primary shadow-[0_0_25px_rgba(255,153,0,0.15)] font-mono"
            : "rounded-3xl border-outline-variant/30 shadow-elevation-2"
        }`}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {theme === "magi" && <span className="w-2.5 h-2.5 bg-primary animate-pulse" />}
            <h1
              className={`text-3xl font-extrabold tracking-tight ${
                theme === "magi" ? "font-mono text-primary uppercase" : "font-display text-on-surface"
              }`}
            >
              {theme === "magi" ? "MAGI-01 COMMAND CLEARANCE" : "NERV Operations Portal"}
            </h1>
          </div>
          <p className="text-on-surface-variant font-medium text-sm">
            {theme === "magi" ? "Tokyo-3 Geofront Level-AAA Terminal Authentication" : "Welcome back, Commander"}
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 text-xs font-mono font-bold border border-error/40"
            role="alert"
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-mono font-bold text-on-surface uppercase tracking-wider"
            >
              Personnel Relay (Email)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="shinji@nerv.hq"
              autoComplete="email"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-mono font-bold text-on-surface uppercase tracking-wider"
            >
              Cipher Passcode
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
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-mono text-base sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-mono text-sm font-bold shadow-xs hover:brightness-110 transition-all active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" color="border-on-primary border-t-transparent" />
                <span>Authenticating with MAGI...</span>
              </>
            ) : (
              <span>Authorize Clearance Access ➜</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail("commander@nerv.hq");
              setPassword("magi-01");
              dispatch(login({ token: "fake-jwt-token-12345" }));
              navigate("/dashboard");
            }}
            className="w-full py-2.5 rounded-xl border border-primary/50 bg-primary/10 text-primary text-xs font-mono font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>⚡</span>
            <span>Quick Commander Clearance Access</span>
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-mono text-on-surface-variant">
          Demo Mode: Any credentials or the Quick Access button grant full access
        </p>
      </div>
    </div>
  );
};

export default Login;
