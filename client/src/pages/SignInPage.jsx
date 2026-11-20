import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { AuthPasswordField } from "../components/AuthPasswordField.jsx";
import { paths } from "../path.js";

function SignInPage() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await login({
        email: formData.get("email"),
        password: formData.get("password"),
      });
      navigate(location.state?.from ?? paths.library, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <p className="auth-eyebrow">Manifest / Account access</p>
      <h1 className="auth-title">Sign in</h1>
      <p className="auth-subtitle">Your delivery ledger, all in one place.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field" htmlFor="signin-email">
          Email
          <input
            autoComplete="email"
            id="signin-email"
            name="email"
            placeholder="you@company.com"
            required
            type="email"
          />
        </label>

        <AuthPasswordField autoComplete="current-password" id="signin-password" />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="auth-switch">
        <Link to={paths.signup}>Create an account</Link>
      </p>
    </AuthLayout>
  );
}

export default SignInPage;