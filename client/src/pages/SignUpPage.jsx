import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { AuthPasswordField } from "../components/AuthPasswordField.jsx";
import { paths } from "../path.js";

function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await register({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
      navigate(paths.library, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <p className="auth-eyebrow">Manifest / New account</p>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">A clear record of every delivery.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field" htmlFor="signup-name">
          Full name
          <input
            autoComplete="name"
            id="signup-name"
            name="name"
            placeholder="Your full name"
            required
            type="text"
          />
        </label>

        <label className="auth-field" htmlFor="signup-email">
          Email
          <input
            autoComplete="email"
            id="signup-email"
            name="email"
            placeholder="you@company.com"
            required
            type="email"
          />
        </label>

        <AuthPasswordField
          autoComplete="new-password"
          helpText="At least 8 characters"
          id="signup-password"
          minLength={8}
        />

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button className="auth-submit" disabled={submitting} type="submit">
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to={paths.login}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}

export default SignUpPage;
