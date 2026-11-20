import "./AuthLayout.css";

const deliveryItems = [
  { index: "01", name: "Brand guidelines", detail: "PDF · 8.4 MB", progress: 1, status: "Dispatched" },
  { index: "02", name: "Logo package", detail: "ZIP · 42.6 MB", progress: 2, status: "Opened" },
  { index: "03", name: "Handover notes", detail: "PDF · 4.8 MB", progress: 3, status: "Received" },
];

function DeliveryPreview() {
  return (
    <div className="auth-showcase">
      <article className="delivery-card" aria-label="Sample delivery manifest">
        <header className="delivery-card-header">
          <div className="delivery-card-meta">
            <span>Delivery manifest</span>
            <span>MF-0482</span>
          </div>
          <h2>Acme Rebrand</h2>
          <p>Prepared for Acme Studio · 24 Oct 2026</p>
        </header>

        <div className="delivery-record-heading">
          <span>Delivery record</span>
          <span>Sent / Opened / Received</span>
        </div>

        <ul className="delivery-items">
          {deliveryItems.map((item) => (
            <li className="delivery-item" key={item.index}>
              <span className="delivery-item-index">{item.index}</span>
              <div className="delivery-item-copy">
                <strong>{item.name}</strong>
                <span>{item.detail}</span>
              </div>
              <div className="delivery-item-status">
                <span className="delivery-progress" aria-hidden="true">
                  {[1, 2, 3].map((step) => (
                    <span
                      className={step <= item.progress ? "is-complete" : ""}
                      key={step}
                    />
                  ))}
                </span>
                <span>{item.status}</span>
              </div>
            </li>
          ))}
        </ul>

        <footer className="delivery-card-footer">
          <span>3 files / 55.8 MB</span>
          <span>All accounted for</span>
        </footer>
      </article>
      <p className="auth-showcase-caption">Every delivery, accounted for.</p>
    </div>
  );
}

export function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <aside className="auth-visual" aria-label="Manifest delivery preview">
        <div className="auth-brand" aria-label="Manifest">
          <span className="auth-brand-mark" aria-hidden="true">M</span>
          <span>Manifest</span>
        </div>

        <DeliveryPreview />

        <p className="auth-visual-footer">Know what you sent. Know it arrived.</p>
      </aside>

      <section className="auth-panel" aria-label="Account access">
        <div className="auth-form-container">{children}</div>
      </section>
    </main>
  );
}
