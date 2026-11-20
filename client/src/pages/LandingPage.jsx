import { Link } from "react-router-dom";
import { paths } from "../path.js";
import "./LandingPage.css";

const assets = [
  { name: "Brand_guidelines.pdf", type: "PDF" },
  { name: "Logo_package.zip", type: "ZIP" },
  { name: "Type_licenses.pdf", type: "PDF" },
  { name: "Handover_notes.pdf", type: "PDF" },
];

const steps = [
  {
    number: "01",
    title: "Collect",
    description: "Bring the final assets together in one clear, numbered manifest.",
    kind: "collect",
  },
  {
    number: "02",
    title: "Dispatch",
    description: "Create a dispatch and send your client a single link.",
    kind: "dispatch",
  },
  {
    number: "03",
    title: "Receipt",
    description: "See when the dispatch was opened and at least one asset downloaded.",
    kind: "receipt",
  },
];

const questions = [
  {
    question: "Do recipients need an account?",
    answer: "No. Recipients can open the dispatch and download assets directly from your link.",
  },
  {
    question: "How long do links last?",
    answer: "You choose 7, 14 or 30 days, or set a date that works for you.",
  },
  {
    question: "What does Received mean?",
    answer: "Received means they downloaded at least one asset. Opening the link alone is marked as Opened.",
  },
  {
    question: "Are my files private?",
    answer: "Only people with the link can access your files. Revoke the link anytime.",
  },
];

function Brand() {
  return (
    <Link aria-label="Manifest home" className="landing-brand" to={paths.home}>
      <span className="landing-brand-mark" aria-hidden="true">M</span>
      <span>Manifest</span>
    </Link>
  );
}

function FileIcon() {
  return (
    <svg aria-hidden="true" className="dispatch-file-icon" fill="none" viewBox="0 0 16 16">
      <path
        d="M4.25 1.75h4.5l3 3v9.5h-7.5z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path d="M8.5 1.9v3h3" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.2" />
    </svg>
  );
}

function DispatchPreview() {
  return (
    <div className="dispatch-preview">
      <article className="dispatch-card" aria-label="Example delivery dispatch">
        <header className="dispatch-card-header">
          <div className="dispatch-card-overline">
            <span>Dispatch · MF-0482</span>
            <span className="dispatch-status">Received</span>
          </div>
          <h2>Acme Rebrand</h2>
          <div className="dispatch-card-subtitle">
            <span>To Alex M.</span>
            <span>4 assets</span>
          </div>
        </header>

        <div className="dispatch-table-heading">
          <span>No.</span>
          <span>Assets</span>
          <span>Type</span>
        </div>

        <ul className="dispatch-assets">
          {assets.map((asset, index) => (
            <li className="dispatch-asset" key={asset.name}>
              <span className="dispatch-asset-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="dispatch-asset-name">
                <FileIcon />
                {asset.name}
              </span>
              <span className="dispatch-asset-type">{asset.type}</span>
            </li>
          ))}
        </ul>

        <div className="dispatch-timeline" aria-label="Sent, opened, received">
          <div className="dispatch-timeline-track">
            <span />
            <span />
            <span />
          </div>
          <div className="dispatch-timeline-labels">
            <span>Sent</span>
            <span>Opened</span>
            <span>Received</span>
          </div>
          <p>24 Oct 2026 · 09:16</p>
        </div>
      </article>
      <p className="dispatch-caption">One dispatch. Every asset accounted for.</p>
    </div>
  );
}

function StepIllustration({ kind }) {
  if (kind === "collect") {
    return (
      <div className="step-illustration step-collect" aria-hidden="true">
        <div className="step-illustration-heading">Assets / final files</div>
        <div><span>01</span><strong>Logo package</strong><small>ZIP</small></div>
        <div><span>02</span><strong>Guidelines</strong><small>PDF</small></div>
      </div>
    );
  }

  if (kind === "dispatch") {
    return (
      <div className="step-illustration step-dispatch" aria-hidden="true">
        <strong>One recipient. One link.</strong>
        <div className="step-link-field">◉ &nbsp; manifest.link / MF-0482</div>
        <span>Copy link</span>
      </div>
    );
  }

  return (
    <div className="step-illustration step-receipt" aria-hidden="true">
      <div className="step-receipt-status"><span /> Received</div>
      <strong>Brand_guidelines.pdf downloaded</strong>
      <small>24 Oct · 09:16</small>
    </div>
  );
}

function ReceiptTimeline() {
  return (
    <article className="receipt-card" aria-label="Example delivery receipt">
      <header className="receipt-card-header">
        <div>
          <p>Receipt / MF-0482</p>
          <h3>Acme Rebrand</h3>
        </div>
        <time dateTime="2026-10-24">24 Oct 2026</time>
      </header>
      <div className="receipt-track">
        <span />
        <span />
        <span />
      </div>
      <div className="receipt-track-labels">
        <span>Sent <small>09:12</small></span>
        <span>Opened <small>09:14</small></span>
        <span>Received <small>09:16</small></span>
      </div>
      <ul className="receipt-events">
        <li>
          <span className="receipt-event-marker" />
          <div><strong>Dispatch sent</strong><p>A single link, four final assets.</p></div>
          <time dateTime="2026-10-24T09:12">09:12</time>
        </li>
        <li>
          <span className="receipt-event-marker" />
          <div><strong>Dispatch opened</strong><p>Your client viewed the manifest.</p></div>
          <time dateTime="2026-10-24T09:14">09:14</time>
        </li>
        <li>
          <span className="receipt-event-marker" />
          <div><strong>Asset downloaded</strong><p>Brand_guidelines.pdf · 8.4 MB</p></div>
          <time dateTime="2026-10-24T09:16">09:16</time>
        </li>
      </ul>
    </article>
  );
}

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Brand />
          <nav aria-label="Main navigation" className="landing-nav">
            <a href="#how-it-works">How it works</a>
            <a href="#receipts">Receipts</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="landing-header-actions">
            <Link className="landing-signin" to={paths.login}>Sign in</Link>
            <Link className="landing-button landing-button-primary" to={paths.signup}>
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="landing-hero">
          <div className="landing-container landing-hero-grid">
            <div className="landing-hero-copy">
              <p className="landing-eyebrow">File delivery, on the record.</p>
              <h1>Know what you sent.<br />Know it arrived.</h1>
              <p className="landing-hero-description">
                Package your final files into one dispatch. Send a single link. See when it was
                opened and received.
              </p>
              <div className="landing-hero-actions">
                <Link className="landing-button landing-button-primary" to={paths.signup}>
                  Create account
                </Link>
                <a className="landing-button landing-button-secondary" href="#how-it-works">
                  See how it works
                </a>
              </div>
              <p className="landing-hero-note">No surprises at handover. Your final files, delivered.</p>
            </div>
            <DispatchPreview />
          </div>
        </section>

        <section className="landing-pain-point" aria-label="Why delivery receipts matter">
          <div className="landing-container landing-pain-grid">
            <div>
              <h2>Files get sent. Then silence.</h2>
              <p>The handover shouldn’t end with a question mark.</p>
            </div>
            <ul>
              <li>Did the client see the link?</li>
              <li>Did they find the right files?</li>
              <li>Did anything actually get downloaded?</li>
            </ul>
          </div>
        </section>

        <section className="landing-how" id="how-it-works">
          <div className="landing-container">
            <p className="landing-eyebrow">01 / How it works</p>
            <h2>A clear handover, in three steps.</h2>
            <p className="landing-section-intro">Assets in order. One link to send. A receipt to keep.</p>
            <div className="landing-steps">
              {steps.map((step) => (
                <article className="landing-step" key={step.number}>
                  <p className="landing-step-heading"><span>{step.number}</span>{step.title}</p>
                  <StepIllustration kind={step.kind} />
                  <p className="landing-step-description">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-receipts" id="receipts">
          <div className="landing-container landing-receipt-grid">
            <div className="landing-receipt-copy">
              <p className="landing-eyebrow">02 / Receipts</p>
              <h2>A receipt, not a guess.</h2>
              <p>
                Follow your dispatch from the moment you send it to the moment your client takes
                delivery.
              </p>
              <div className="landing-receipt-note">
                Received means they downloaded at least one asset. An opened link is not a
                download, so you’ll know the difference.
              </div>
            </div>
            <ReceiptTimeline />
          </div>
        </section>

        <section className="landing-faq" id="faq">
          <div className="landing-container landing-faq-grid">
            <div className="landing-faq-heading">
              <p className="landing-eyebrow">03 / The details</p>
              <h2>A few things to know.</h2>
              <p>Simple for you. Simple for the person receiving your work.</p>
            </div>
            <div className="landing-faq-list">
              {questions.map(({ question, answer }) => (
                <details className="landing-faq-item" key={question} open>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <div className="landing-container landing-cta-inner">
            <div>
              <h2>Send your next delivery with proof.</h2>
              <p>Your work is finished. Give the handover a proper ending.</p>
            </div>
            <Link className="landing-button landing-button-primary" to={paths.signup}>
              Create account
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <Brand />
          <span className="landing-copyright">2027 Manifest</span>
          <nav aria-label="Footer navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#receipts">Receipts</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
