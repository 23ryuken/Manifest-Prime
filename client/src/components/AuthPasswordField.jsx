import { useState } from "react";

export function AuthPasswordField({
  autoComplete,
  helpText,
  id,
  minLength,
  name = "password",
  placeholder = "Enter your password",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <div className="auth-field-heading">
        <label htmlFor={id}>Password</label>
        <button
          aria-label={`${visible ? "Hide" : "Show"} password`}
          aria-pressed={visible}
          className="auth-password-toggle"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
            <path
              d="M1.5 8s2.2-4 6.5-4 6.5 4 6.5 4-2.2 4-6.5 4-6.5-4-6.5-4Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.4"
            />
            <circle cx="8" cy="8" r="1.7" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      <input
        autoComplete={autoComplete}
        id={id}
        minLength={minLength}
        name={name}
        placeholder={placeholder}
        required
        type={visible ? "text" : "password"}
      />
      {helpText && (
        <>
          <div className="auth-password-meter" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="auth-field-help">{helpText}</p>
        </>
      )}
    </div>
  );
}
