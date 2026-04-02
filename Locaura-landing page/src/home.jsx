import { useState, useEffect, useRef } from "react";
import logo from "./assets/Locaura.png";
import videoBg from "./assets/Locauravideo.mp4";
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Hook for scroll-triggered animations
function useScrollReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

// ─────────────────────────────────────────────
// WAITLIST FORM COMPONENT (reusable)
// ─────────────────────────────────────────────
function WaitlistForm({ dark = false }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name) {
      setError("Please enter your name and email");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          segment: 'shop',
          city: 'Vizag'
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        console.log("Waitlist saved:", data);
        setPromoCode(data.promoCode);
        setSubmitted(true);
        setCopied(false);
        setError("");
        setEmail("");
        setName("");
      } else {
        setError(data.error || "Error registering. Please try again.");
      }

    } catch (err) {
      console.error("Error:", err);
      setError("⚠️ Server not responding. Make sure Node.js backend is running on port 5000. Run: node server.js");
    }
  };

  if (submitted) {
    return (
      <div style={{
        background: dark ? "rgba(14,165,233,0.1)" : "rgba(14,165,233,0.06)",
        border: `1.5px solid ${dark ? "rgba(14,165,233,0.4)" : "rgba(14,165,233,0.3)"}`,
        borderRadius: 20,
        padding: "clamp(18px, 4vw, 32px) clamp(14px, 4vw, 28px)",
        textAlign: "center",
        maxWidth: 520,
        margin: "0 auto",
      }}>
        <div style={{ fontSize: "clamp(34px, 10vw, 48px)", marginBottom: 12, animation: "bounce 0.6s" }}>🎉</div>
        <div style={{ fontSize: "clamp(17px, 5vw, 20px)", fontWeight: 900, color: dark ? "#fff" : "#111", marginBottom: 4 }}>Successfully Registered!</div>
        <div style={{ fontSize: "clamp(12px, 3.3vw, 14px)", color: dark ? "rgba(255,255,255,0.6)" : "#666", marginBottom: 18 }}>Your exclusive promo code for free delivery:</div>
        
        <div style={{
          background: dark ? "rgba(0,0,0,0.25)" : "#fff",
          border: `2.5px solid #000000`,
          borderRadius: 16,
          padding: "clamp(12px, 3.4vw, 16px)",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap"
        }}>
          <div style={{
            fontSize: "clamp(15px, 4.2vw, 18px)",
            fontWeight: 900,
            color: "#000000",
            letterSpacing: "1.2px",
            fontFamily: "monospace",
            flex: "1 1 100%",
            textAlign: "center",
            overflowWrap: "anywhere"
          }}>
            {promoCode}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(promoCode).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              });
            }}
            style={{
              background: copied ? "#16A34A" : "#EF4444",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              width: "100%"
            }}
            onMouseEnter={e => { e.target.style.background = copied ? "#15803D" : "#DC2626"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = copied ? "#16A34A" : "#EF4444"; e.target.style.transform = "translateY(0)"; }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div style={{ background: dark ? "rgba(14,165,233,0.08)" : "rgba(14,165,233,0.06)", borderRadius: 12, padding: "clamp(12px, 3.2vw, 16px)", marginBottom: 14, border: `1px solid ${dark ? "rgba(14,165,233,0.25)" : "rgba(14,165,233,0.2)"}` }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: dark ? "#fff" : "#111", marginBottom: 6 }}>How to use:</div>
          <div style={{ fontSize: "clamp(11px, 3.1vw, 12px)", color: dark ? "rgba(255,255,255,0.7)" : "#666", lineHeight: 1.6 }}>
            1. Download the Locaura app (coming soon)<br />
            2. Enter this code at checkout on your first order<br />
            3. Get FREE same-day delivery
          </div>
        </div>

        <div style={{ fontSize: "clamp(11px, 3vw, 12px)", color: dark ? "rgba(255,255,255,0.5)" : "#999", marginBottom: 14 }}>
          We'll notify you when the app launches in your area!
        </div>

        <button
          onClick={() => setSubmitted(false)}
          style={{
            background: dark ? "rgba(255,255,255,0.08)" : "rgba(14,165,233,0.1)",
            border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(14,165,233,0.25)"}`,
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 600,
            color: dark ? "#fff" : "#333",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={e => { 
            e.target.style.background = dark ? "rgba(255,255,255,0.15)" : "rgba(14,165,233,0.18)";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => { 
            e.target.style.background = dark ? "rgba(255,255,255,0.08)" : "rgba(14,165,233,0.1)";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Close
        </button>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    background: dark ? "rgba(255,255,255,0.08)" : "#fff",
    border: dark ? "1.5px solid rgba(255,255,255,0.14)" : "1.5px solid #e8e8e8",
    borderRadius: 12,
    padding: "13px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: dark ? "#fff" : "#111",
    fontFamily: "'Nunito', sans-serif",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        style={inputStyle}
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Your Email Address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
      />
      {error && (
        <div style={{ background: "#ffe8e8", border: "1px solid #ffcccc", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#000000", fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          background: "#EF4444",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          padding: "14px 32px",
          fontSize: 15,
          fontWeight: 900,
          cursor: "pointer",
          fontFamily: "'Nunito', sans-serif",
          transition: "background 0.2s, transform 0.15s",
          letterSpacing: "-0.3px",
        }}
        onMouseEnter={e => { e.target.style.background = "#DC2626"; e.target.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.target.style.background = "#EF4444"; e.target.style.transform = "translateY(0)"; }}
      >
        Join Waitlist
      </button>
      <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.35)" : "#aaa", textAlign: "center", marginTop: 2 }}>
        We'll notify you once our app is live. No spam, ever.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EARLY ACCESS FORMS COMPONENT
// ─────────────────────────────────────────────
function EarlyAccessForms({ dark = false }) {
  const [retailerForm, setRetailerForm] = useState({ name: "", mobile: "", shopName: "", location: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleRetailerSubmit = async () => {
    if (!retailerForm.name || !retailerForm.mobile || !retailerForm.shopName || !retailerForm.location) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/retailer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: retailerForm.name,
          email: retailerForm.email || `${retailerForm.shopName}@retailer.locaura.in`,
          mobile: retailerForm.mobile,
          shopName: retailerForm.shopName,
          location: retailerForm.location
        })
      });

      const data = await res.json();
      console.log("Retailer registered:", data);

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      setRetailerForm({ name: "", mobile: "", shopName: "", location: "" });
    } catch (err) {
      console.error("Error:", err);
      alert("Error registering. Please try again.");
    }
  };

  const inputStyle = {
    width: "100%",
    background: dark ? "rgba(255,255,255,0.07)" : "#fff",
    border: dark ? "1.5px solid rgba(255,255,255,0.13)" : "1.5px solid #e8e8e8",
    borderRadius: 12,
    padding: "13px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: dark ? "#fff" : "#111",
    fontFamily: "'Nunito', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: dark ? "rgba(255,255,255,0.45)" : "#999",
    marginBottom: 6,
    display: "block",
  };

  if (submitted) {
    return (
      <div style={{
        background: dark ? "rgba(0,0,0,0.12)" : "rgba(14,165,233,0.06)",
        border: `1.5px solid ${dark ? "rgba(0,0,0,0.3)" : "rgba(14,165,233,0.3)"}`,
        borderRadius: 20,
        padding: "36px 32px",
        textAlign: "center",
        maxWidth: 520,
        margin: "0 auto",
      }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: dark ? "#fff" : "#111", marginBottom: 8 }}>You're on the list!</div>
        <div style={{ fontSize: 14, color: dark ? "rgba(255,255,255,0.5)" : "#888" }}>We'll reach out as soon as Locaura launches in your city.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>Your Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Priya Mehta"
            value={retailerForm.name}
            onChange={e => setRetailerForm({ ...retailerForm, name: e.target.value })}
          />
        </div>
        <div>
          <label style={labelStyle}>Mobile Number</label>
          <input
            style={inputStyle}
            placeholder="+91 98765 43210"
            value={retailerForm.mobile}
            onChange={e => setRetailerForm({ ...retailerForm, mobile: e.target.value })}
          />
        </div>
        <div>
          <label style={labelStyle}>Shop / Business Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Mehta Fashion House"
            value={retailerForm.shopName}
            onChange={e => setRetailerForm({ ...retailerForm, shopName: e.target.value })}
          />
        </div>
        <div>
          <label style={labelStyle}>Location / City</label>
          <input
            style={inputStyle}
            placeholder="e.g. Hyderabad, Telangana"
            value={retailerForm.location}
            onChange={e => setRetailerForm({ ...retailerForm, location: e.target.value })}
          />
        </div>
        <button
          onClick={handleRetailerSubmit}
          style={{
            background: "#EF4444",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "15px 32px",
            fontSize: 15,
            fontWeight: 900,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            marginTop: 4,
            transition: "background 0.2s, transform 0.15s",
            letterSpacing: "-0.3px",
          }}
          onMouseEnter={e => { e.target.style.background = "#DC2626"; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.background = "#EF4444"; e.target.style.transform = "translateY(0)"; }}
        >
          Partner with Locaura
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CITIES PAGE
// ─────────────────────────────────────────────
function CitiesPage({ onNavigate }) {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "#060606" }}>
      <div style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "100px 32px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        {/* Animated city icon */}
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          background: "#EF4444",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, marginBottom: 32,
          boxShadow: "0 20px 60px rgba(14,165,233,0.35)",
        }}>🏙️</div>

        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: "3px",
          textTransform: "uppercase", color: "#000000", marginBottom: 16,
        }}>
          City Launch
        </div>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "linear-gradient(135deg, rgba(0,0,0,0.15), rgba(0,0,0,0.1))",
          border: "1.5px solid rgba(0,0,0,0.4)",
          borderRadius: 100,
          padding: "6px 16px",
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: "#000000", letterSpacing: "0.5px" }}>(MOST POPULAR)</span>
        </div>

        <h1 style={{
          fontSize: 58, fontWeight: 900, color: "#fff",
          letterSpacing: "-3px", lineHeight: 1.05, marginBottom: 20,
        }}>
          Coming Soon to<br />
          <span style={{
            background: "#EF4444",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>Visakhapatnam</span>
        </h1>

        <p style={{
          fontSize: 18, color: "rgba(255,255,255,0.45)",
          lineHeight: 1.75, maxWidth: 480, marginBottom: 48,
        }}>
          Locaura is expanding fast. We're launching in Vizag very soon — same-day delivery of fashion, footwear, and electronics, right to your door.
        </p>

        {/* City highlights */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16, marginBottom: 56, width: "100%", maxWidth: 520,
        }}>
          {[
            { icon: "", label: "Same-Day Delivery" },
            { icon: "🏪", label: "Local Stores" },
            { icon: "📦", label: "50,000+ Products" },
          ].map(item => (
            <div key={item.label} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16, padding: "20px 12px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Waitlist for this city */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 480,
          marginBottom: 40,
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
            Get notified when we launch in Vizag
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>
            Be the first to shop from local stores near you.
          </div>
          <WaitlistForm dark={true} />
        </div>

        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "transparent",
            border: "1.5px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.5)",
            borderRadius: 12, padding: "12px 28px",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED NAV & FOOTER (used on all pages)
// ─────────────────────────────────────────────
function SharedNav({ scrollY, onNavigate, currentPage, mobileMenuOpen, setMobileMenuOpen }) {
  const solid = currentPage !== "home" || scrollY > 20;
  return (
    <nav className={`nav ${solid ? "solid" : ""}`}>
      <div className="nav-logo" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
        <img src={logo} alt="Locaura" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
          <span className="nav-logo-text">Locaura</span>
        </div>
      </div>
      <div className="nav-links">
        <a className="nav-link" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>How it works</a>
        <a className="nav-link" onClick={() => onNavigate("cities")} style={{ cursor: "pointer" }}>Cities</a>
        <a
          className="nav-link"
          href="mailto:support@locaura.in?subject=Business%20Inquiry%20-%20Locaura&body=Hi%20Locaura%20Team%2C%0A%0AI%20am%20interested%20in%20partnering%20with%20Locaura%20for%20my%20business.%0A%0APlease%20get%20back%20to%20me.%0A%0AThank%20you!"
          style={{ cursor: "pointer", textDecoration: "none" }}
        >
          For Businesses
        </a>
        <a className="nav-link" onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Blog</a>
      </div>
      
      {/* MOBILE HAMBURGER */}
      <button className="nav-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
        background: "none",
        border: "none",
        fontSize: 24,
        cursor: "pointer",
        color: "#fff",
        padding: "8px 0",
        display: "none",
        zIndex: 1000,
      }}>
        ☰
      </button>

      <button className="nav-cta" onClick={() => alert('Download app coming soon! Join the waitlist.')} style={{ cursor: "pointer" }}>Get the App</button>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "rgba(8,8,8,0.98)",
          backdropFilter: "blur(20px)",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 999,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <a onClick={() => { onNavigate("home"); setMobileMenuOpen(false); }} style={{ cursor: "pointer", textDecoration: "none", color: "rgba(255,255,255,0.68)", fontWeight: 700, fontSize: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>How it works</a>
          <a onClick={() => { onNavigate("cities"); setMobileMenuOpen(false); }} style={{ cursor: "pointer", textDecoration: "none", color: "rgba(255,255,255,0.68)", fontWeight: 700, fontSize: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Cities</a>
          <a href="mailto:support@locaura.in?subject=Business%20Inquiry%20-%20Locaura&body=Hi%20Locaura%20Team%2C%0A%0AI%20am%20interested%20in%20partnering%20with%20Locaura%20for%20my%20business.%0A%0APlease%20get%20back%20to%20me.%0A%0AThank%20you!" onClick={() => setMobileMenuOpen(false)} style={{ cursor: "pointer", textDecoration: "none", color: "rgba(255,255,255,0.68)", fontWeight: 700, fontSize: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>For Businesses</a>
          <a href="https://blog.locaura.in" onClick={() => setMobileMenuOpen(false)} style={{ cursor: "pointer", textDecoration: "none", color: "rgba(255,255,255,0.68)", fontWeight: 700, fontSize: 14, padding: "12px 0" }}>Blog</a>
        </div>
      )}
    </nav>
  );
}

function SharedFooter({ onNavigate }) {
  const GooglePlayIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M3.18 1.5 13.5 12 3.18 22.5c-.45-.24-.68-.68-.68-1.18V2.68c0-.5.23-.94.68-1.18z" fill="#EA4335"/>
      <path d="M17.5 8.5 14.5 12l3 3.5 4.12-2.38c.58-.34.88-.78.88-1.12s-.3-.78-.88-1.12L17.5 8.5z" fill="#FBBC04"/>
      <path d="M3.18 1.5 13.5 12l4-4L5.62.38C5.1.07 4.52.03 3.18 1.5z" fill="#4285F4"/>
      <path d="M3.18 22.5C4.52 23.97 5.1 23.93 5.62 23.62L17.5 15.5l-4-4-10.32 10.5z" fill="#34A853"/>
    </svg>
  );

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <img src={logo} alt="Locaura" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
            <span className="footer-brand-name">Locaura</span>
          </div>
          <p className="footer-brand-copy">© 2026 Locaura Technologies Pvt. Ltd.<br />CIN: U74120MH2024PTC000001</p>
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            <a href="https://twitter.com/locaura" target="_blank" rel="noopener noreferrer" className="social-btn" title="Twitter">
              <FaTwitter size={20} />
            </a>
            <a href="https://facebook.com/locaura" target="_blank" rel="noopener noreferrer" className="social-btn" title="Facebook">
              <FaFacebook size={20} />
            </a>
            <a href="https://instagram.com/locaura" target="_blank" rel="noopener noreferrer" className="social-btn" title="Instagram">
              <FaInstagram size={20} />
            </a>
            <a href="https://youtube.com/locaura" target="_blank" rel="noopener noreferrer" className="social-btn" title="YouTube">
              <FaYoutube size={20} />
            </a>
          </div>
          <div className="store-btns-dark">
            <div className="store-btn-sm">
              <GooglePlayIcon />
              <div className="store-btn-sm-label"><small>Get it on</small><strong>Google Play</strong></div>
            </div>
          </div>
        </div>
        {[
          { 
            title: "Locaura", 
            links: [
              { label: "Who We Are", page: "contact" },
              { label: "Careers", link: "mailto:careers@locaura.in" },
              { label: "Press", link: "mailto:press@locaura.in" },
              { label: "Investor Relations", link: "mailto:support@locaura.in" },
              { label: "Blog", page: "home" }
            ]
          },
          { 
            title: "For Brands & Stores", 
            links: [
              { label: "Partner With Us", page: "contact" },
              { label: "Seller App", link: "mailto:sellers@locaura.in" },
              { label: "Logistics API", link: "mailto:logistics@locaura.in" },
              { label: "Brand Solutions", link: "mailto:brands@locaura.in" }
            ]
          },
          { 
            title: "For Delivery Partners", 
            links: [
              { label: "Join as Partner", page: "contact" },
              { label: "Partner App", link: "mailto:partners@locaura.in" },
              { label: "Earnings", link: "mailto:support@locaura.in" },
              { label: "Support", page: "contact" }
            ]
          },
          {
            title: "Learn More", 
            links: [
              { label: "Privacy Policy", page: "privacy" },
              { label: "Terms of Service", page: "terms" },
              { label: "Refund & Cancellation", page: "refund" },
              { label: "Delivery Policy", page: "delivery" },
              { label: "Seller Terms", page: "seller" },
              { label: "Delivery Partner Terms", page: "delivery-partner" },
              { label: "Contact & Support", page: "contact" },
              { label: "Dispute Resolution", link: "mailto:disputes@locaura.in" },
            ]
          },
        ].map(col => (
          <div key={col.title}>
            <div className="footer-col-title">{col.title}</div>
            {col.links.map(l => {
              const label = typeof l === "string" ? l : l.label;
              const page = typeof l === "string" ? null : l.page;
              const link = typeof l === "string" ? null : l.link;

              // If it has a mailto link
              if (link) {
                return (
                  <a
                    key={label}
                    className="footer-lnk"
                    href={link}
                    style={{ cursor: "pointer" }}
                  >
                    {label}
                  </a>
                );
              }

              // If it has a page route
              if (page) {
                return (
                  <a
                    key={label}
                    className="footer-lnk"
                    onClick={() => { onNavigate(page); window.scrollTo(0, 0); }}
                    style={{ cursor: "pointer" }}
                  >
                    {label}
                  </a>
                );
              }

              // Default fallback for unmapped links
              return (
                <a key={label} className="footer-lnk" style={{ opacity: 0.5, cursor: "default" }}>
                  {label}
                </a>
              );
            })}
          </div>
        ))}
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <div className="footer-countries">
          {["India", "UAE", "Saudi Arabia", "USA", "UK", "Singapore"].map(c => (
            <span key={c} className="footer-country">{c}</span>
          ))}
        </div>
        <div style={{ fontSize: 13, color: "#333" }}>Made with 💙 in India</div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// POLICY PAGE WRAPPER
// ─────────────────────────────────────────────
function PolicyPage({ title, subtitle, icon, children, onNavigate, allPolicies, currentPage }) {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="policy-hero-icon">{icon}</div>
        <div className="policy-hero-tag">Legal & Policies</div>
        <h1 className="policy-hero-title">{title}</h1>
        <p className="policy-hero-sub">{subtitle}</p>
        <div className="policy-last-updated">Last updated: January 2026</div>
        {/* Go to Home button */}
        <button
          onClick={() => { onNavigate("home"); window.scrollTo(0, 0); }}
          style={{
            marginTop: 20,
            background: "rgba(255,255,255,0.08)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.7)",
            borderRadius: 10,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            position: "relative",
            zIndex: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.25)"; e.currentTarget.style.borderColor = "#000000"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        >
          🏠 Go to Home
        </button>
      </div>

      <div className="policy-layout">
        <aside className="policy-sidebar">
          <div className="policy-sidebar-title">All Policies</div>
          {allPolicies.map(p => (
            <button
              key={p.page}
              className={`policy-sidebar-btn ${currentPage === p.page ? "active" : ""}`}
              onClick={() => { onNavigate(p.page); window.scrollTo(0, 0); }}
            >
              <span className="policy-sidebar-icon">{p.icon}</span>
              {p.label}
            </button>
          ))}
          <div className="policy-sidebar-contact">
            <div style={{ fontWeight: 800, fontSize: 13, color: "#111", marginBottom: 8 }}>Need help?</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
              Email us at<br />
              <a href="mailto:support@locaura.in" style={{ color: "#000000", fontWeight: 700 }}>support@locaura.in</a>
            </div>
          </div>
        </aside>

        <main className="policy-content">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// INDIVIDUAL POLICY PAGE CONTENTS
// ─────────────────────────────────────────────

function TermsPage({ onNavigate, allPolicies }) {
  return (
    <PolicyPage title="Terms & Conditions" subtitle="Please read these terms carefully before using Locaura." icon="📋" onNavigate={onNavigate} allPolicies={allPolicies} currentPage="terms">
      <div className="prose-policy">
        <h2>User Eligibility</h2>
        <p>To use Locaura, you must be at least 18 years old or a legally registered entity. When creating an account, you agree to provide accurate and truthful business or personal information. You are solely responsible for keeping your login credentials secure and confidential, and you accept full accountability for all activity that occurs under your account.</p>
        <h2>Marketplace Role</h2>
        <p>Locaura operates as a B2B platform that connects retailers and suppliers (referred to as sellers) with customers (referred to as buyers). Locaura does not take ownership of any products listed on the platform — any contract of sale is strictly between the Buyer and the Seller. All prices displayed on Locaura are in Indian Rupees (INR) and include applicable taxes such as GST unless clearly stated otherwise. Sellers are responsible for setting their own prices, and Locaura may charge a platform commission or service fee in connection with transactions facilitated through the platform.</p>
        <h2>Orders and Payment</h2>
        <p>All orders placed on Locaura must be paid for in full before they are processed. We accept payments through a variety of secure methods including Razorpay, credit and debit cards, UPI, net banking, and other supported wallets. While we use industry-standard payment gateways, Locaura shall not be held liable for failures or delays caused by third-party payment processors. Please note that product pricing may change before an order is confirmed, and we reserve the right to modify or cancel orders after notifying you. A sale is not considered final until the seller formally confirms the order.</p>
        <h2>Shipping and Delivery</h2>
        <p>All orders are shipped directly from the seller's location to your specified delivery address. Locaura offers both standard and express delivery options, with shipping charges calculated based on distance and weight and displayed clearly at checkout. Delivery timeframes are estimates — while Locaura aims to complete local deliveries within one business day, external factors such as traffic, adverse weather, or logistical disruptions may occasionally cause delays. You will be kept informed of your shipment's status via SMS or email updates. In the event that a delivery attempt is unsuccessful due to the customer being unavailable, Locaura or the seller may arrange a second delivery attempt or, at their discretion, cancel and refund the order in accordance with our policy.</p>
        <h2>Returns and Cancellations</h2>
        <p>We allow you to cancel an order before it has been dispatched and will issue a full refund with no restocking fee. If an order has already been dispatched at the time of cancellation, a cancellation fee may apply depending on the product type and value — this will always be communicated to you before the cancellation is finalised. For returns, if you receive a product that is defective, damaged, or different from what was ordered, you may initiate a return. Issues must be reported within 3 to 7 days of delivery, and the item must be returned in its original, unused condition with all original packaging intact. Once a return is received and inspected, a refund will be processed via the original payment method, typically within 7 to 14 business days. Certain product categories — including perishables, hygiene-sealed goods, and clearance items — may be designated as non-returnable, and this will be clearly indicated on the respective product listing page.</p>
        <h2>User Conduct</h2>
        <p>By using Locaura, you agree not to use the platform for any unlawful purpose. Any form of harassment, fraudulent behaviour, submission of fake reviews, spam, or listing of illegal goods is strictly prohibited. Locaura reserves the right to suspend or permanently terminate any account found to be in violation of these terms. All content on our platform — including text, images, logos, and other materials — is the intellectual property of Locaura and is protected under applicable copyright law. You may not copy, reproduce, or republish any such content without prior written permission.</p>
        <h2>Disclaimers and Limitation of Liability</h2>
        <p>Locaura provides its platform on an "as is" and "as available" basis and does not guarantee continuous, uninterrupted access to its services. We shall not be held liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to delivery delays or product defects. The sellers listed on Locaura — not Locaura itself — are solely responsible for the products they sell and for any warranties, guarantees, or representations made about those products.</p>
        <h2>Governing Law and Updates</h2>
        <p>Locaura may update or amend these Terms and Conditions at any time without prior notice. Your continued use of the platform following any such changes constitutes your acceptance of the revised terms. These terms are governed by the laws of India, and any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Hyderabad, Telangana.</p>
      </div>
    </PolicyPage>
  );
}

function PrivacyPage({ onNavigate, allPolicies }) {
  return (
    <PolicyPage title="Privacy Policy" subtitle="How we collect, use, and protect your personal information." icon="🔒" onNavigate={onNavigate} allPolicies={allPolicies} currentPage="privacy">
      <div className="prose-policy">
        <h2>Data We Collect</h2>
        <p>Locaura collects personal information from all users of the platform — including buyers, sellers, and delivery partners. This includes, but is not limited to, your full name, delivery address, contact number, email address, government-issued identification (for the purpose of identity verification), bank account and GST details (for business accounts), and order and payment history. In addition to personally identifiable information, we also collect usage data such as the pages you visit, your IP address, device information, and transaction records, all of which help us improve the experience we offer.</p>
        <h2>How We Use Your Data</h2>
        <p>The primary purpose for which we use your personal data is to process and fulfil your orders — this includes coordinating payments, arranging delivery, and providing effective customer support. Beyond order fulfilment, your data helps us personalise and improve the platform, including generating product recommendations and targeted promotional offers tailored to your preferences and browsing behaviour. We also use your data to detect and prevent fraud, and to comply with our legal and regulatory obligations under Indian law, such as issuing GST-compliant tax invoices. For business buyers, we collect PAN and GST registration details specifically to meet these invoicing requirements.</p>
        <h2>Sharing Your Information</h2>
        <p>Locaura does not sell, rent, or trade your personal information to any third party. We do share certain necessary data with trusted third-party service providers, but only to the extent required for them to perform specific services on our behalf. This includes sharing your payment information with our payment gateway partners, your delivery address with our logistics and delivery partners, and technical data with our cloud infrastructure and customer service providers. These partners are contractually obligated to use your information only for the purposes for which it was shared. We may also disclose your information where required to do so by applicable law, court order, or directive from a government authority.</p>
        <h2>Cookies and Tracking</h2>
        <p>We use cookies and similar tracking technologies to enhance your experience on the Locaura platform. Cookies are used for session management, to remember your preferences, and to support our analytics functions. On their own, cookies do not contain personally identifiable information. If you prefer, you can disable cookies through your browser settings, though please note that doing so may affect the functionality of certain features on the platform. We also use third-party analytics tools such as Google Analytics to understand how users engage with our platform; the use of such tools is subject to the respective provider's own privacy policy.</p>
        <h2>Data Retention and Security</h2>
        <p>We retain your personal information for as long as is necessary to provide our services and to comply with applicable legal requirements. For example, under Indian tax law, certain financial and transaction records must be retained for a minimum number of years. Once your data is no longer required, it is either anonymised or securely deleted. To protect your information from unauthorised access, alteration, or disclosure, we implement a range of technical and organisational security measures, including data encryption, secure server infrastructure, and strict internal access controls. However, no system can be guaranteed to be completely secure, and we encourage you to take care in protecting your own account credentials.</p>
        <h2>Your Rights</h2>
        <p>In accordance with Indian data protection norms and applicable law, you may have the right to request access to the personal data we hold about you, to request corrections to inaccurate or incomplete information, or to request the deletion of your data in certain circumstances. To exercise any of these rights, or if you have any questions or concerns about this Privacy Policy, please contact our designated Data Protection Officer at privacy@locaura.in.</p>
      </div>
    </PolicyPage>
  );
}

function RefundPage({ onNavigate, allPolicies }) {
  return (
    <PolicyPage title="Refund & Cancellation Policy" subtitle="Understand your rights and our commitments for refunds and cancellations." icon="💰" onNavigate={onNavigate} allPolicies={allPolicies} currentPage="refund">
      <div className="prose-policy">
        <h2>Order Cancellation</h2>
        <p>You may cancel any order placed on Locaura at any time before it has been dispatched by the seller, and you will receive a full refund with no restocking fee charged. Upon submitting a cancellation request, Locaura will confirm the refund amount with you before the cancellation is finalised. If your order has already been dispatched at the time of the cancellation request, a cancellation fee may apply depending on the product category and order value, and this fee will be clearly communicated to you before you confirm the cancellation.</p>
        <h2>Returns for Defective or Incorrect Items</h2>
        <p>If you receive a product that is damaged, defective, or materially different from what you ordered, you are entitled to initiate a return. We recommend raising a return request within 3 days of delivery, and requests will be considered for up to 7 days post-delivery. To be eligible for a return, the item must be unused, in its original packaging, and accompanied by all original accessories or documentation. If the return is attributable to an error on the part of the seller or Locaura, we will arrange the return pickup at no additional cost to you. Once we have received and inspected the returned item, we will issue either a replacement or a full refund as applicable.</p>
        <h2>Refund Process and Timeline</h2>
        <p>Approved refunds will be credited to the original payment method used at the time of purchase. This process typically takes between 7 and 14 business days from the date the return is approved. For orders that were placed using cash on delivery, refunds will be issued via bank transfer or as store credit. Locaura operates in compliance with the Consumer Protection (E-Commerce) Rules 2020, under which sellers are required to honour refunds for products that are defective, not as described, or delivered beyond the promised timeframe (subject to force majeure exceptions). If your order is delivered later than the committed delivery window, you may choose to cancel the order and receive a full refund.</p>
        <h2>Fees and Non-Returnable Items</h2>
        <p>We do not charge any restocking fees for cancellations made before dispatch. However, if an order is cancelled after it has been dispatched and without a valid reason being provided, a return shipping fee may be deducted from your refund. Any charges that are non-refundable — such as certain tax components or wallet credit adjustments — will always be clearly disclosed to you before the transaction is completed. Certain categories of products are not eligible for return once delivered; these include perishable goods, custom-manufactured or made-to-order items, and personal hygiene products. Any such exceptions will be clearly indicated on the product listing page before you place your order.</p>
        <h2>Seller-Initiated Cancellations</h2>
        <p>In the event that a seller is unable to fulfil your order — for example, due to a stock shortage or an unforeseen operational issue — Locaura will cancel the order on your behalf and issue a full refund promptly. Sellers on the Locaura platform are contractually required to maintain fair and transparent refund policies and to provide customers with clear information regarding returns and cancellations at the time of purchase.</p>
      </div>
    </PolicyPage>
  );
}

function DeliveryPage({ onNavigate, allPolicies }) {
  return (
    <PolicyPage title="Delivery Policy" subtitle="How we get your orders to you, fast and safely." icon="🚚" onNavigate={onNavigate} allPolicies={allPolicies} currentPage="delivery">
      <div className="prose-policy">
        <h2>Our Local Delivery Promise</h2>
        <p>Locaura has built its network by partnering with local stores and established delivery services to offer same-day and next-day delivery within supported cities. The specific delivery window available for your order — such as "by 9 PM today" or "within 48 hours" — will be displayed during checkout before you confirm your purchase. Orders are typically dispatched on the same or next business day. Delivery availability is dependent on your location; if you are outside our current service zones, the option to place an order may not be presented to you during checkout.</p>
        <h2>Shipping Costs</h2>
        <p>Delivery fees on Locaura are calculated based on the distance between the seller's location and your delivery address, as well as the size and weight of the order. All applicable charges are calculated transparently and shown to you before you finalise your order, so there are no surprises at the time of payment. From time to time, Locaura may run free delivery promotions for orders above a specified value — these will be prominently communicated within the app and on the website.</p>
        <h2>Handling Delays</h2>
        <p>While we are committed to meeting the delivery windows shown at checkout, delays can occasionally occur due to factors outside our direct control, such as heavy traffic, adverse weather conditions, or other unforeseen events. If your delivery is delayed, we will notify you promptly with a revised estimated delivery time. In situations involving extreme delays caused by force majeure events — including natural disasters, civil disruptions, or government-mandated restrictions — you will have the option to cancel your order and receive a full refund.</p>
        <h2>Delivery Attempts and Failed Deliveries</h2>
        <p>If our delivery partner is unable to deliver your order because no one is available at the specified address, they will contact you via call or message to coordinate the delivery. We will make up to two delivery attempts; if both attempts are unsuccessful, the order may be cancelled or the package may be redirected to a nearby pickup point, depending on the circumstances. Any additional charges that may apply for a rescheduled delivery will be communicated to you in advance.</p>
        <h2>Lost or Damaged Items in Transit</h2>
        <p>In the unfortunate event that your order is lost or damaged during transit, please notify Locaura as soon as possible after becoming aware of the issue. We will work closely with the delivery partner and the seller to investigate the matter and arrange either a replacement or a full refund. Perishable items that spoil as a result of a delivery delay caused by Locaura or our delivery partners are also covered under our refund policy.</p>
        <h2>Delivery Partner Standards</h2>
        <p>All delivery partners working with Locaura are required to adhere to our safety and hygiene standards at all times. For your security, deliveries may include photo confirmation upon drop-off or an OTP-based verification to confirm receipt. If your order has been paid for online, please do not make any additional cash payment to the delivery person at the time of delivery — all charges should have been settled during the checkout process.</p>
      </div>
    </PolicyPage>
  );
}

function SellerPage({ onNavigate, allPolicies }) {
  return (
    <PolicyPage title="Seller / Retailer Terms" subtitle="Guidelines and responsibilities for selling on the Locaura platform." icon="🏪" onNavigate={onNavigate} allPolicies={allPolicies} currentPage="seller">
      <div className="prose-policy">
        <h2>Eligibility and Registration</h2>
        <p>To sell on Locaura, you must be a registered business or retailer operating in compliance with all applicable local, state, and central laws of India. You must hold a valid GST registration and PAN, both of which will be required during the onboarding process. During registration, sellers are required to submit accurate business details including the legal business name, headquarter and branch addresses, official website, contact email, phone number, and GST and PAN information. Sellers must verify their identity through supporting documentation such as a GST certificate or a valid business licence, and are obligated to keep all business information current and up to date at all times.</p>
        <h2>Fair Trading Obligations</h2>
        <p>Sellers on Locaura are expected to conduct their business with integrity and in accordance with fair trade practices as defined under Indian consumer protection law. It is strictly prohibited to post or solicit fake customer reviews, to misrepresent product quality or features, or to engage in any form of deceptive advertising. All product descriptions, images, and promotional content must accurately reflect the actual product, including its features, intended usage, and physical condition. Prices displayed must represent the full cost to the buyer, inclusive of all taxes, shipping charges, and applicable fees. Sellers dealing in regulated product categories must ensure they hold and display all required certifications and must clearly display relevant product information such as expiry dates and country of origin as required by law.</p>
        <h2>Order Fulfilment</h2>
        <p>By listing products on Locaura and accepting orders, sellers commit to fulfilling those orders according to the terms represented at the time of sale. This includes maintaining adequate inventory levels, packaging orders appropriately, and ensuring items are ready for pickup by Locaura's delivery partners at the agreed time. Sellers are required to honour the price confirmed at the time of order and to follow all delivery instructions provided. In the event that a seller is unable to fulfil an order, the seller must notify Locaura promptly so that the order can be cancelled and a full refund issued to the customer without unnecessary delay.</p>
        <h2>Returns and Refunds</h2>
        <p>Sellers are required to comply with Locaura's returns and refund policy in full. In line with the Consumer Protection (E-Commerce) Rules 2020, sellers must accept returns and process refunds for items that are defective, incorrectly described, or not delivered within the promised timeframe, unless the delay was caused by a force majeure event. Any return shipping fee policies applicable to the seller must be clearly communicated to both Locaura and the buyer at the time of listing or order confirmation. As a general principle, the cost of return shipping is borne by the seller in cases where the return is the result of a seller's error or product defect.</p>
        <h2>Payments and GST Compliance</h2>
        <p>Locaura collects all payments from buyers on behalf of sellers and remits the net amount — after deducting the applicable platform commission — to sellers according to the agreed payout schedule, which is typically weekly. Sellers must provide accurate and active bank account details for the receipt of payouts. All tax obligations arising from sales on the platform, including GST, are the responsibility of the seller. Locaura will generate and issue transaction invoices that include the seller's GSTIN as required under Indian tax law.</p>
        <h2>Prohibited Activities</h2>
        <p>Sellers are strictly prohibited from listing items that are illegal, counterfeit, or otherwise prohibited under applicable law. Creating duplicate product listings, artificially inflating inventory counts, or operating multiple accounts with the intent to manipulate platform ratings or search rankings is forbidden and may result in immediate suspension. Sellers must ensure that all listed products comply with Locaura's product safety standards and meet any applicable quality requirements prescribed by law.</p>
        <h2>Grievance Officer and Complaint Resolution</h2>
        <p>As mandated under the Consumer Protection (E-Commerce) Rules 2020, every seller on the Locaura platform is required to designate a Grievance Officer who is responsible for addressing consumer complaints. The name and contact details of this officer must be provided to Locaura and kept current. Sellers are required to acknowledge consumer complaints within 48 hours of receipt and to resolve them within 30 days. Persistent non-compliance with this requirement will result in the suspension or permanent termination of the seller's account on the platform.</p>
      </div>
    </PolicyPage>
  );
}

function DeliveryPartnerPage({ onNavigate, allPolicies }) {
  return (
    <PolicyPage title="Delivery Partner Terms" subtitle="Terms and conditions for our delivery partners on the Locaura network." icon="🛵" onNavigate={onNavigate} allPolicies={allPolicies} currentPage="delivery-partner">
      <div className="prose-policy">
        <h2>Independent Contractor Status</h2>
        <p>Delivery partners (referred to as DPs) engaged by Locaura operate as independent contractors and not as employees of the company. This means that as a delivery partner, you retain the freedom to set your own working hours, to choose when you are available on the platform, and to accept or decline individual delivery requests at your discretion. There are no fixed shifts or minimum hour commitments — you indicate your availability simply by logging into the Locaura Delivery App.</p>
        <h2>Registration Requirements</h2>
        <p>To register as a delivery partner with Locaura, you must be at least 18 years of age and provide valid documentation to complete the onboarding process. The required documents include a government-issued identity proof (Aadhaar card or PAN card), a valid two-wheeler driving licence, the vehicle's registration certificate, valid vehicle insurance, and a current Pollution Under Control (PUC) certificate. All applicants must consent to a background verification and KYC check. You are required to provide accurate personal details including your name, residential address, and contact number, as well as your bank account details to facilitate the receipt of earnings.</p>
        <h2>Use of the Platform</h2>
        <p>As a delivery partner, you will be required to use the Locaura Delivery App on your personal smartphone to receive and manage delivery requests. Your login credentials are personal and must not be shared with any other individual. The app will send you delivery request notifications, which you should respond to promptly. It is your responsibility to keep the app updated to the latest version and to ensure that GPS and location services are enabled on your device at all times while you are on duty, as these are essential for order navigation and tracking.</p>
        <h2>Delivery Obligations</h2>
        <p>Upon accepting a delivery request, you commit to collecting the item promptly from the designated seller or warehouse and delivering it to the customer's specified address in a safe, timely, and professional manner. You are required to comply with all applicable traffic laws and road safety regulations throughout the delivery. Basic hygiene standards must be maintained — this includes keeping your delivery vehicle clean and handling packages with appropriate care. Personal protective equipment such as helmets must be worn at all times while riding. Under no circumstances may you delegate or subcontract a delivery to another person.</p>
        <h2>Safety, Responsibility, and Liability</h2>
        <p>You are personally and solely responsible for your own safety, the safety of your vehicle, and your conduct on the road. Any traffic violations, accidents, or incidents that occur during a delivery are your personal liability. You are required to maintain valid insurance coverage for both personal injury and vehicle damage. In the event of an accident or injury sustained while on duty, Locaura will provide support in facilitating applicable insurance claim processes as required by law; however, the ultimate responsibility for safety and compliance rests with you.</p>
        <h2>Conduct Standards and Customer Interaction</h2>
        <p>All delivery partners are expected to maintain a professional and courteous demeanour at all times when interacting with customers. This includes greeting customers politely, verifying the delivery using any applicable OTP confirmation process, and ensuring the customer is satisfied before concluding the delivery. If a customer is unreachable upon arrival, you must attempt to contact them by phone before taking any further action. All incidents must be reported immediately through the app. Failure to meet performance and conduct standards may result in financial penalties or suspension from the platform.</p>
        <h2>Earnings and Working Terms</h2>
        <p>Your earnings as a delivery partner will be paid on a per-delivery or hourly basis as agreed at the time of onboarding. All payments will be transferred directly to your registered bank account — please ensure your bank details are accurate and kept up to date. You are responsible for maintaining your own equipment, including your vehicle and smartphone, at your own expense. Locaura may from time to time offer additional incentives such as performance bonuses or surge pricing during high-demand periods; any such schemes will be clearly communicated to you in advance through the app.</p>
      </div>
    </PolicyPage>
  );
}

function ContactPage({ onNavigate, allPolicies }) {
  return (
    <PolicyPage title="Contact & Support" subtitle="We're here to help — reach us through any of these channels." icon="📞" onNavigate={onNavigate} allPolicies={allPolicies} currentPage="contact">
      <div className="prose-policy">
        <div className="contact-cards">
          {[
            { icon: "📞", title: "Toll-Free Helpline", detail: "+91 93986 59378", sub: "Available 24×7", color: "#000000" },
            { icon: "📧", title: "Email Support", detail: "support@locaura.in", sub: "Response within 24–48 hours", color: "#5B4FE8", mailto: "mailto:support@locaura.in?subject=Support%20Request" },
            { icon: "💬", title: "In-App Chat", detail: "Help → Contact Support", sub: "Live chat or ticketing", color: "#1DB954" },
            { icon: "📱", title: "WhatsApp Helpline", detail: "+91 93986 59378", sub: "Quick queries & support", color: "#25D366" },
          ].map(c => (
            <div key={c.title} className="contact-card">
              <div className="contact-card-icon" style={{ background: c.color + "18", color: c.color }}>{c.icon}</div>
              <div className="contact-card-title">{c.title}</div>
              {c.mailto
                ? <a href={c.mailto} className="contact-card-detail" style={{ color: c.color, textDecoration: "none" }}>{c.detail}</a>
                : <div className="contact-card-detail" style={{ color: c.color }}>{c.detail}</div>
              }
              <div className="contact-card-sub">{c.sub}</div>
            </div>
          ))}
        </div>
        <h2>Business and Partner Support</h2>
        <p>Retailers, brand partners, and delivery partners can reach our dedicated support team through any of the channels listed above, or by writing directly to <a href="mailto:support@locaura.in" style={{ color: "#000000", fontWeight: 700 }}>support@locaura.in</a>. We aim to respond to all B2B and partner inquiries within one business day. For urgent business matters, please call our business helpline and a member of our team will assist you as quickly as possible.</p>
        <h2>Grievance Redressal</h2>
        <p>In accordance with the requirements of the Consumer Protection (E-Commerce) Rules 2020, Locaura has appointed a designated Grievance Officer to handle consumer complaints. You can reach the Grievance Officer by email at <a href="mailto:support@locaura.in" style={{ color: "#000000", fontWeight: 700 }}>support@locaura.in</a>. All grievances submitted through these channels will be formally acknowledged within 48 hours of receipt, and we are committed to resolving every complaint within 30 days. You also have the right to contact the National Consumer Helpline at 1915 or via WhatsApp at 8800001915 for independent assistance with e-commerce disputes.</p>
        <h2>Registered Office</h2>
        <p>For all formal written communications, our registered office address is: Locaura Internet Private Limited, 1234 Corporate Avenue, Tech Park, Hyderabad – 500081, Telangana, India.</p>
      </div>
    </PolicyPage>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState("home");
  const [betterRef, betterVisible] = useScrollReveal(0.15);
  const [showStickyEmail, setShowStickyEmail] = useState(false);
  const [countdown, setCountdown] = useState({ days: 9, hours: 0, minutes: 0, seconds: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitIntentEmail, setExitIntentEmail] = useState("");
  const [exitIntentSubmitted, setExitIntentSubmitted] = useState(false);
  const [exitIntentPromoCode, setExitIntentPromoCode] = useState("");
  const [exitIntentError, setExitIntentError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState("shop");
  const [segmentFormData, setSegmentFormData] = useState({ 
    shop: { city: "", email: "", submitted: false, promoCode: "", error: "" },
    sell: { shopName: "", category: "", email: "", submitted: false, promoCode: "", error: "" },
    deliver: { vehicleType: "", phone: "", email: "", submitted: false, promoCode: "", error: "" }
  });
  const [showCountdownInHeader, setShowCountdownInHeader] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      // Show sticky email after scrolling 400px
      setShowStickyEmail(window.scrollY > 400);
      // Show countdown in header after scrolling past hero
      setShowCountdownInHeader(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Countdown Timer for city launch - April 10, 2026
  useEffect(() => {
    const updateCountdown = () => {
      const launchDate = new Date('2026-04-10T00:00:00').getTime();
      const now = new Date().getTime();
      const totalSeconds = Math.max(0, Math.floor((launchDate - now) / 1000));
      
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000); // Update every second
    return () => clearInterval(timer);
  }, []);

  // Dynamic Waitlist Counter - Increments by 2 every hour (starting from 0)
  useEffect(() => {
    const updateCounter = () => {
      const startTime = new Date('2026-04-01').getTime();
      const now = new Date().getTime();
      const hoursElapsed = Math.floor((now - startTime) / (1000 * 60 * 60));
      setWaitlistCount(Math.max(0, hoursElapsed * 2));
    };
    updateCounter();
    const timer = setInterval(updateCounter, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  // Exit-intent popup detector
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !showExitIntent && currentPage === "home") {
        setShowExitIntent(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [showExitIntent, currentPage]);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allPolicies = [
    { page: "terms", label: "Terms & Conditions", icon: "📋" },
    { page: "privacy", label: "Privacy Policy", icon: "🔒" },
    { page: "refund", label: "Refund & Cancellation", icon: "💰" },
    { page: "delivery", label: "Delivery Policy", icon: "🚚" },
    { page: "seller", label: "Seller Terms", icon: "🏪" },
    { page: "delivery-partner", label: "Delivery Partner Terms", icon: "🛵" },
    { page: "contact", label: "Contact & Support", icon: "📞" },
  ];

  const categories = [
    { emoji: "👕", label: "Fashion" },
    { emoji: "👟", label: "Footwear" },
    { emoji: "📱", label: "Electronics" },
    { emoji: "🎧", label: "Audio" },
    { emoji: "💄", label: "Beauty" },
    { emoji: "🏠", label: "Home & Living" },
    { emoji: "🎮", label: "Gaming" },
    { emoji: "⌚", label: "Watches" },
  ];

  const features = [
    { icon: "", title: "Live Delivery Tracking", desc: "Watch your order move on the map in real time, street by street." },
    { icon: "📦", title: "Hyperlocal Inventory", desc: "Only items stocked at nearby stores — no surprises, no delays." },
    { icon: "🎯", title: "Smart Recommendations", desc: "AI picks trending items based on weather, events & your style." },
    { icon: "💬", title: "Chat with Delivery Agent", desc: "Coordinate delivery instantly — no missed packages, ever." },
    { icon: "🔄", title: "Same-Day Returns", desc: "Free pickup within 24 hours. No questions asked." },
    { icon: "💳", title: "Flexible Payments", desc: "UPI, EMI, wallets, pay on delivery — your choice." },
    { icon: "🎁", title: "Gift Wrapping", desc: "Add a personal note & gift wrap. Perfect for last-minute gifting." },
    { icon: "🔔", title: "Smart Notifications", desc: "Get notified when your fave brands restock nearby." },
  ];

  const apps = [
    { name: "Locaura", tag: "Core App", icon: "image", image: "/src/assets/Locaura.png", bg: "linear-gradient(135deg,#000000,#000000)", desc: "Order clothes, shoes & gadgets and get them delivered the same day — right to your door." },
    { name: "Locaura express", tag: "Speed Mode", icon: "🚀", bg: "linear-gradient(135deg,#F5A623,#f0c040)", desc: "Need it in 2 hours? Swift Express prioritises your order for ultra-fast city delivery." },
    { name: "Locaura biz", tag: "B2B", icon: "🏢", bg: "linear-gradient(135deg,#5B4FE8,#8b7cf6)", desc: "Bulk orders for offices & businesses. Uniforms, electronics — sourced and delivered fast." },
    { name: "Locaura picks", tag: "Discovery", icon: "🛍️", bg: "linear-gradient(135deg,#1DB954,#14a845)", desc: "AI-curated product picks based on city trends, season, and your personal style." },
  ];

  const benefits = [
    { icon: "", title: "Same-Day Delivery", desc: "Order before 2 PM, receive by evening — guaranteed in your city." },
    { icon: "📍", title: "Hyperlocal Stock", desc: "Only products at nearby stores are shown — zero wait, zero disappointment." },
    { icon: "🔄", title: "Easy Returns", desc: "Free same-day return pickup within 24 hours." },
    { icon: "💳", title: "Best Prices", desc: "We match or beat any local store price. Always." },
  ];

  const GooglePlayIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M3.18 1.5 13.5 12 3.18 22.5c-.45-.24-.68-.68-.68-1.18V2.68c0-.5.23-.94.68-1.18z" fill="#EA4335"/>
      <path d="M17.5 8.5 14.5 12l3 3.5 4.12-2.38c.58-.34.88-.78.88-1.12s-.3-.78-.88-1.12L17.5 8.5z" fill="#FBBC04"/>
      <path d="M3.18 1.5 13.5 12l4-4L5.62.38C5.1.07 4.52.03 3.18 1.5z" fill="#4285F4"/>
      <path d="M3.18 22.5C4.52 23.97 5.1 23.93 5.62 23.62L17.5 15.5l-4-4-10.32 10.5z" fill="#34A853"/>
    </svg>
  );

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; scroll-behavior: smooth; }
    body { font-family: 'Nunito', sans-serif; overflow-x: hidden; width: 100%; background: #fff; }

    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 999;
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 80px;
      transition: background 0.35s, box-shadow 0.35s;
    }
    .nav.solid {
      background: rgba(8,8,8,0.93);
      backdrop-filter: blur(20px);
      box-shadow: 0 1px 0 rgba(255,255,255,0.06);
    }
    .nav-logo { display: flex; align-items: center; gap: 14px; transition: transform 0.2s ease; }
    .nav-logo:hover { transform: translateY(-2px); }
    .nav-logo img { width: 44px; height: 44px; object-fit: contain; object-position: center; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1); transition: all 0.3s ease; background: rgba(255, 255, 255, 0.02); padding: 2px; }
    .nav-logo:hover img { box-shadow: 0 6px 20px rgba(0,0,0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15); transform: scale(1.05); }
    .nav-logo-text { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -0.5px; transition: all 0.2s ease; }
    .nav-logo-tagline { font-size: 10px; font-weight: 700; color: #EF4444; letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s ease; }
    .nav-links { display: flex; align-items: center; gap: 40px; }
    .nav-link { color: rgba(255,255,255,0.68); font-size: 14px; font-weight: 600; cursor: pointer; transition: color 0.15s; text-decoration: none; }
    .nav-link:hover { color: #fff; }
    .nav-cta { background: #EF4444; color: #fff; border: none; border-radius: 8px; padding: 11px 26px; font-size: 14px; font-weight: 800; cursor: pointer; font-family: 'Nunito', sans-serif; transition: background 0.2s, transform 0.15s; }
    .nav-cta:hover { background: #DC2626; transform: translateY(-1px); }

    /* ── HERO ── */
    .hero {
      width: 100%; min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      position: relative; overflow: hidden; text-align: center;
      background: #000;
    }
    .hero-video {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      object-fit: cover; z-index: 0;
      -webkit-backface-visibility: hidden; backface-visibility: hidden;
    }
    .hero-gradient {
      background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 35%, rgba(0,0,0,0.65) 100%);
      z-index: 1;
    }
    .hero-content {
      position: relative; z-index: 3; padding: 0 24px;
      display: flex; flex-direction: column; align-items: center;
      animation: heroFadeUp 1s ease both;
    }
    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .hero-brand { font-size: 68px; font-weight: 900; font-style: italic; color: #fff; letter-spacing: -2px; line-height: 1; margin-bottom: 18px; text-shadow: 0 2px 24px rgba(0,0,0,0.5); }
    .hero-headline { font-size: 52px; font-weight: 900; color: #fff; line-height: 1.1; letter-spacing: -2px; margin-bottom: 10px; text-shadow: 0 2px 20px rgba(0,0,0,0.4); }
    .hero-sub { font-size: 22px; color: #fff; margin-bottom: 40px; line-height: 1.6; font-weight: 500; text-shadow: 0 1px 8px rgba(0,0,0,0.5); }
    .store-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .store-btn-zomato {
      display: flex; align-items: center; gap: 12px;
      background: #111; border: 2px solid rgba(255,255,255,0.18); border-radius: 12px;
      padding: 13px 24px; cursor: pointer; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
      text-decoration: none; min-width: 190px;
    }
    .store-btn-zomato:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.4); }
    .store-btn-labels small { display: block; font-size: 10px; letter-spacing: 0.5px; font-weight: 600; color: rgba(255,255,255,0.55); font-family: 'Nunito', sans-serif; }
    .store-btn-labels strong { display: block; font-size: 18px; font-weight: 800; font-family: 'Nunito', sans-serif; color: #fff; line-height: 1.1; }
    .scroll-cue {
      position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
      z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 6px;
      color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 700; letter-spacing: 1px;
      animation: bobble 2.2s ease-in-out infinite;
    }
    .scroll-chevron { font-size: 22px; color: rgba(255,255,255,0.5); animation: bobble 2.2s ease-in-out infinite; }
    @keyframes bobble { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }

    /* ── WAITLIST BADGE (hero) ── */
    .waitlist-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, rgba(0,0,0,0.18), rgba(0,0,0,0.12));
      border: 1.5px solid rgba(0,0,0,0.5);
      border-radius: 100px;
      padding: 8px 20px;
      margin-bottom: 20px;
      animation: pulseBadge 2.5s ease-in-out infinite;
    }
    @keyframes pulseBadge {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.3); }
      50% { box-shadow: 0 0 0 8px rgba(0,0,0,0); }
    }
    .waitlist-badge-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #EF4444;
      animation: blinkDot 1.4s ease-in-out infinite;
    }
    @keyframes blinkDot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .waitlist-badge-text {
      font-size: 12px; font-weight: 800; letter-spacing: 1px;
      text-transform: uppercase; color: #EF4444;
    }

    /* ── EARLY ACCESS HERO BAND ── */
    .early-access-band {
      background: #060606;
      padding: 80px 80px;
      position: relative;
      overflow: hidden;
    }
    .early-access-band::before {
      content: '';
      position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
      width: 700px; height: 700px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 65%);
      pointer-events: none;
    }
    .early-access-inner {
      position: relative; z-index: 2;
      max-width: 580px; margin: 0 auto; text-align: center;
    }
    .early-access-eyebrow {
      font-size: 11px; font-weight: 800; letter-spacing: 2.5px;
      text-transform: uppercase; color: #EF4444; margin-bottom: 12px;
    }
    .early-access-title {
      font-size: 48px; font-weight: 900; color: #fff;
      letter-spacing: -2px; line-height: 1.05; margin-bottom: 14px;
    }
    .early-access-sub {
      font-size: 16px; color: rgba(255,255,255,0.4);
      line-height: 1.7; margin-bottom: 40px;
    }

    /* ── SHARED SECTION ── */
    .section-tag { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: #EF4444; margin-bottom: 14px; }
    .section-title { font-size: 52px; font-weight: 900; color: #0d0d0d; line-height: 1.06; letter-spacing: -2px; }

    /* ── BETTER ── */
    .better-wrap { padding: 100px 80px; max-width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
    .better-images { position: relative; height: 500px; display: flex; justify-content: center; align-items: flex-start; }
    .img-card { position: absolute; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 72px rgba(0,0,0,0.15); opacity: 0; transition: opacity 0.7s ease, transform 0.7s ease; }
    .img-card img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
    .img-card-0 { transform: translateX(-60px) rotate(-4deg); }
    .img-card-1 { transform: translateY(60px) rotate(3deg); }
    .img-card-2 { transform: translateX(60px) rotate(-3deg); }
    .img-card.visible { opacity: 1 !important; transform: translateX(0) translateY(0) rotate(0deg) !important; }
    .img-card-0.visible { transition-delay: 0s; }
    .img-card-1.visible { transition-delay: 0.18s; }
    .img-card-2.visible { transition-delay: 0.34s; }
    .floating-badge { position: absolute; background: #fff; border-radius: 16px; padding: 13px 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.14); display: flex; align-items: center; gap: 13px; z-index: 5; }
    @media (max-width: 900px) {
      .floating-badge { padding: 10px 16px; font-size: 13px; }
    }
    @media (max-width: 600px) {
      .floating-badge { padding: 8px 12px; font-size: 11px; display: none; }
    }
    .fb-icon { width: 42px; height: 42px; border-radius: 12px; background: #fff5f3; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    @media (max-width: 900px) {
      .fb-icon { width: 36px; height: 36px; font-size: 18px; }
    }
    .fb-title { font-size: 14px; font-weight: 800; color: #111; }
    .fb-sub { font-size: 15px; color: #111; }
    .benefit-list { display: flex; flex-direction: column; gap: 22px; margin-top: 36px; }
    .benefit-item { display: flex; align-items: flex-start; gap: 18px; }
    .benefit-icon { width: 48px; height: 48px; border-radius: 14px; background: #fff2ec; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
    .benefit-title { font-size: 16px; font-weight: 800; color: #111; margin-bottom: 4px; }
    .benefit-desc { font-size: 14px; color: #999; line-height: 1.55; }

    /* ── WHY LOCAURA SECTION ── */
    .why-locaura-desc { font-size: 19px; color: #888; line-height: 1.75; margin-top: 16px; }

    /* ── STATS ── */
    .stats-bar { border-top: 1px solid #efefef; border-bottom: 1px solid #efefef; }
    .stats-inner { max-width: 100%; margin: 0; padding: 70px 80px; display: grid; grid-template-columns: repeat(3,1fr); }
    .stat { text-align: center; border-right: 1px solid #efefef; padding: 0 40px; }
    .stat:last-child { border-right: none; }
    .stat-icon { font-size: 34px; margin-bottom: 12px; }
    .stat-value { font-size: 58px; font-weight: 900; color: #0d0d0d; letter-spacing: -2.5px; line-height: 1; }
    .stat-value span { color: #EF4444; }
    .stat-label { font-size: 15px; color: #444; font-weight: 800; margin-top: 8px; }
    .stat-tag { font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:#EF4444; margin-bottom:6px; }

    /* ── FEATURES ── */
    .features-section { background: #f7f7f7; padding: 100px 0; }
    .features-header { text-align: center; margin-bottom: 64px; padding: 0 80px; }
    .features-sub { font-size: 17px; color: #888; max-width: 480px; margin: 14px auto 0; line-height: 1.75; font-weight: 500; }
    .features-grid { display: grid; grid-template-columns: 1fr 340px 1fr; gap: 32px; max-width: 100%; padding: 0 80px; }
    .feat-col { display: flex; flex-direction: column; gap: 18px; }
    .feat-item { background: #fff; border-radius: 20px; padding: 24px; display: flex; align-items: flex-start; gap: 18px; box-shadow: 0 2px 16px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
    .feat-item:hover { transform: scale(1.025); box-shadow: 0 10px 36px rgba(0,0,0,0.1); }
    .feat-icon { width: 50px; height: 50px; border-radius: 14px; background: #fff2ec; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
    .feat-title { font-size: 15px; font-weight: 800; color: #111; margin-bottom: 5px; }
    .feat-desc { font-size: 13px; color: #999; line-height: 1.55; }
    .phone-wrap { background: #1a1a1a; border-radius: 54px; padding: 14px; box-shadow: 0 40px 100px rgba(0,0,0,0.3); }
    .phone-screen { background: linear-gradient(160deg, #000000 0%, #000000 45%, #1a1a1a 100%); border-radius: 42px; height: 640px; display: flex; flex-direction: column; align-items: center; gap: 11px; padding: 28px 20px; position: relative; overflow: hidden; }
    .phone-screen::before { content:''; position:absolute; top:-60px; right:-60px; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,0.07); }
    .phone-topbar { width:100%; display:flex; justify-content:space-between; align-items:center; }
    .phone-topbar span { color:rgba(255,255,255,0.5); font-size:12px; font-weight:700; }
    .phone-brand { color:#fff; font-size:20px; font-weight:900; align-self:flex-start; }
    .phone-city { color:rgba(255,255,255,0.5); font-size:11px; align-self:flex-start; margin-top:-6px; }
    .phone-search { width:100%; background:rgba(255,255,255,0.12); border-radius:12px; padding:11px 16px; display:flex; align-items:center; gap:10px; border:1px solid rgba(255,255,255,0.15); }
    .phone-search span { color:rgba(255,255,255,0.45); font-size:13px; }
    .phone-row { width:100%; background:rgba(255,255,255,0.1); border-radius:14px; padding:12px 16px; display:flex; align-items:center; gap:12px; border:1px solid rgba(255,255,255,0.12); cursor:pointer; transition:background 0.15s; }
    .phone-row:hover { background:rgba(255,255,255,0.18); }
    .phone-row-label { font-size:13px; font-weight:700; color:#fff; }
    .phone-row-sub { font-size:10px; color:rgba(255,255,255,0.5); }
    .phone-row-arrow { margin-left:auto; color:rgba(255,255,255,0.3); font-size:20px; }

    /* ── ECO ── */
    .eco-section { padding: 100px 80px; background: #fff; }
    .eco-header { text-align:center; margin-bottom:60px; }
    .eco-eternal { font-size: 80px; font-weight: 900; color: #0d0d0d; letter-spacing: -4px; line-height: 1; margin-bottom: 10px; }
    .eco-sub { font-size: 12px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: #ccc; }
    .eco-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; max-width:1000px; margin:0 auto; }
    .eco-card { background:#fafafa; border:1px solid #efefef; border-radius:24px; padding:36px; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s; }
    .eco-card:hover { transform:translateY(-5px); box-shadow:0 20px 56px rgba(0,0,0,0.09); }
    .eco-icon { width:68px; height:68px; border-radius:20px; display:flex; align-items:center; justify-content:center; font-size:34px; margin-bottom:18px; box-shadow:0 6px 20px rgba(0,0,0,0.15); }
    .eco-tag { font-size:10px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:#bbb; margin-bottom:8px; }
    .eco-name { font-size:22px; font-weight:900; color:#111; margin-bottom:11px; }
    .eco-desc { font-size:14px; color:#888; line-height:1.65; margin-bottom:20px; }
    .eco-link { color:#EF4444; font-size:14px; font-weight:800; display:flex; align-items:center; gap:5px; }

    /* ── CATEGORIES ── */
    .cat-section { background:#f7f7f7; padding:100px 80px; text-align:center; }
    .cat-chips { display:flex; justify-content:center; gap:14px; flex-wrap:wrap; margin-top:44px; }
    .cat-chip { display:flex; align-items:center; gap:11px; background:#fff; border:1.5px solid #eee; border-radius:100px; padding:14px 28px; font-size:16px; font-weight:700; color:#333; cursor:pointer; transition:all 0.18s; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
    .cat-chip:hover { background:#EF4444; color:#fff; border-color:#EF4444; transform:translateY(-2px); box-shadow:0 8px 24px rgba(239,68,68,0.3); }
    .cat-chip-icon { font-size:24px; }

    /* ── DOWNLOAD ── */
    .download-wrap { padding: 100px 80px; display:grid; grid-template-columns:1fr 1fr; gap:100px; align-items:center; }
    .download-title { font-size: 60px; font-weight: 900; color: #111; letter-spacing: -3px; line-height: 1.05; margin-bottom: 20px; }
    .download-title span { color: #EF4444; }
    .download-sub { font-size: 17px; color: #888; line-height: 1.75; margin-bottom: 44px; }
    .qr-card { background:#f7f7f7; border-radius:28px; padding:44px; display:flex; flex-direction:column; align-items:center; gap:22px; }
    .qr-label { font-size: 15px; font-weight: 700; color: #555; }
    .qr-block { width:190px; height:190px; background:#111; border-radius:22px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .qr-pill { display:flex; align-items:center; gap:13px; background:#fff2ec; border:1px solid #ffc9b0; border-radius:16px; padding:14px 24px; }
    .qr-pill-name { font-size:16px; font-weight:900; color:#EF4444; }
    .qr-pill-sub { font-size:12px; color:#bbb; }

    /* ── FOOTER ── */
    .footer { background:#090909; padding:72px 80px 38px; }
    .footer-grid { display:grid; grid-template-columns:2.2fr 1fr 1fr 1fr 1fr; gap:52px; margin-bottom:60px; }
    .footer-brand-name { font-size:22px; font-weight:900; color:#fff; }
    .footer-brand-copy { font-size:13px; color:#444; line-height:1.8; margin:14px 0 24px; }
    .footer-col-title { font-size:11px; font-weight:800; color:#fff; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:20px; }
    .footer-lnk { display:block; font-size:13px; color:#555; margin-bottom:13px; cursor:pointer; transition:color 0.15s; text-decoration:none; }
    .footer-lnk:hover { color:#ccc; }
    .footer-divider { border:none; border-top:1px solid #1c1c1c; margin-bottom:30px; }
    .footer-bottom { display:flex; justify-content:space-between; align-items:center; }
    .footer-countries { display:flex; gap:24px; flex-wrap:wrap; }
    .footer-country { font-size:13px; color:#444; cursor:pointer; transition:color 0.15s; }
    .footer-country:hover { color:#888; }
    .social-btn { 
      width: 40px; 
      height: 40px; 
      border-radius: 50%; 
      background: #1a1a1a; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      cursor: pointer; 
      font-size: 17px; 
      transition: all 0.15s;
      color: #888;
      border: 1.5px solid #2a2a2a;
      text-decoration: none;
    }
    .social-btn:hover { 
      background: #EF4444;
      color: #fff;
      border-color: #EF4444;
      transform: translateY(-3px);
    }
    .store-btns-dark { display:flex; flex-direction:column; gap:10px; margin-top:20px; }
    .store-btn-sm { display:flex; align-items:center; gap:11px; background:#1a1a1a; border:1px solid #2a2a2a; border-radius:11px; padding:11px 18px; cursor:pointer; transition:border-color 0.15s; }
    .store-btn-sm:hover { border-color:#555; }
    .store-btn-sm-label small { display:block; font-size:9px; color:#666; letter-spacing:0.5px; }
    .store-btn-sm-label strong { display:block; font-size:14px; font-weight:800; color:#fff; font-family:'Nunito',sans-serif; }
    .store-btn-dl { display: flex; align-items: center; gap: 12px; background: #111; border: 2px solid #333; border-radius: 12px; padding: 13px 24px; cursor: pointer; transition: transform 0.18s, box-shadow 0.18s; text-decoration: none; min-width: 175px; }
    .store-btn-dl:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.25); border-color: #666; }
    .store-btn-dl .store-btn-labels small { color: rgba(255,255,255,0.5); font-size: 10px; font-weight: 600; display: block; letter-spacing: 0.5px; }
    .store-btn-dl .store-btn-labels strong { color: #fff; font-size: 17px; font-weight: 800; display: block; font-family: 'Nunito', sans-serif; }

    /* ── HERO BADGES & URGENCY ── */
    .hero-badge-group {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      animation: fadeInDown 0.8s ease;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      padding: 10px 18px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 700;
      backdrop-filter: blur(15px);
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    /* ── SECONDARY CTA BUTTON ── */
    .store-btn-secondary {
      background: rgba(239,68,68,0.15);
      border: 2px solid #EF4444;
      color: #fff;
      border-radius: 12px;
      padding: 13px 32px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Nunito', sans-serif;
      letter-spacing: -0.3px;
    }
    .store-btn-secondary:hover {
      background: #EF4444;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(239,68,68,0.4);
    }

    /* ── STORE BUTTONS RESPONSIVE ── */
    .store-btn-primary {
      min-width: 200px;
    }

    /* ── MOBILE OPTIMIZATION ── */
    @media (max-width: 900px) {
      body { text-align: center; }
      .nav { padding: 16px 24px; }
      .nav-logo { gap: 12px; }
      .nav-logo img { width: 40px; height: 40px; border-radius: 10px; padding: 2px; }
      .nav-logo-text { font-size: 18px; }
      .nav-logo-tagline { font-size: 9px; }
      .nav-links { display: none !important; }
      .nav-hamburger { display: flex !important; align-items: center; justify-content: center; }
      .nav-link { font-size: 13px; }
      .nav-cta { padding: 9px 18px; font-size: 13px; }
      
      .hero-badge-group { gap: 10px; margin-bottom: 18px; justify-content: center; }
      .hero-badge { padding: 8px 14px; font-size: 11px; }
      .hero-headline { font-size: 38px; lineHeight: 1.1; }
      .hero-sub { font-size: 16px; }
      .store-btns { flex-direction: column; align-items: center; gap: 12px; }
      .store-btn-primary { min-width: 100%; }
      .store-btn-secondary { width: 100%; }

      .better-wrap { padding: 40px 16px; grid-template-columns: 1fr; gap: 30px; display: flex; flex-direction: column-reverse; text-align: center; }
      .better-images { height: 270px; position: relative; flex-shrink: 0; margin: 0 auto; display: flex; justify-content: center; align-items: flex-start; width: 100%; overflow: hidden; }
      .img-card { position: absolute; width: min(86vw, 250px); height: min(70vw, 220px); left: 50% !important; right: auto !important; top: 10px !important; bottom: auto !important; transform: translateX(-50%) !important; }
      .img-card-0 { transform: translateX(-50%) !important; opacity: 1 !important; z-index: 2; }
      .img-card-1 { display: none; }
      .img-card-2 { display: none; }
      
      .features-section { padding: 60px 24px; text-align: center; }
      .features-grid { grid-template-columns: 1fr; padding: 0 16px; gap: 24px; }
      .feat-item { flex-direction: column; text-align: center; align-items: center; }
      .phone-wrap { display: none; }
      
      .stats-inner { padding: 40px 16px; grid-template-columns: 1fr; text-align: center; }
      .stat { border-right: none; border-bottom: 1px solid #efefef; padding: 24px 0; text-align: center; }
      .stat:last-child { border-bottom: none; }
      
      .eco-section { padding: 60px 16px; text-align: center; }
      .eco-grid { grid-template-columns: 1fr; }
      .eco-card { text-align: center; }
      
      .cat-section { padding: 60px 16px; text-align: center; }
      .cat-chips { margin-top: 24px; justify-content: center; }
      
      .download-wrap { grid-template-columns: 1fr; gap: 40px; padding: 60px 16px; text-align: center; }
      .download-title { font-size: 40px; }
      
      .footer { padding: 48px 16px 24px; text-align: center; }
      .footer-grid { grid-template-columns: 1fr; gap: 32px; }
      .footer-bottom { flex-direction: column; gap: 20px; }
      .footer-countries { justify-content: center; }
      
      .policy-layout { grid-template-columns: 1fr; }
      .policy-sidebar { position: relative; top: auto; padding: 24px 0; border-right: none; border-bottom: 1px solid #f0f0f0; min-height: auto; text-align: center; }
      .policy-content { padding: 40px 16px; max-width: 100%; text-align: left; }
    }

    @media (max-width: 600px) {
      html { font-size: 14px; text-align: center; }
      body { text-align: center; }
      
      .hero-headline { font-size: 28px; }
      .hero-sub { font-size: 14px; }
      .hero-brand { font-size: 48px; }
      .hero-badge-group { gap: 8px; margin-bottom: 14px; justify-content: center; }
      .hero-badge { padding: 6px 12px; font-size: 10px; }
      
      .section-title { font-size: 32px; text-align: center; }
      .section-tag { font-size: 12px; text-align: center; }
      
      .better-wrap { padding: 30px 16px; gap: 20px; display: flex; flex-direction: column-reverse; text-align: center; align-items: center; }
      .better-images { height: 250px; max-height: 250px; position: relative; flex-shrink: 0; margin: 0 auto; display: flex; justify-content: center; align-items: flex-start; width: 100%; overflow: hidden; }
      .img-card { width: min(88vw, 230px); height: min(66vw, 200px); left: 50% !important; right: auto !important; top: 8px !important; bottom: auto !important; transform: translateX(-50%) !important; }
      .img-card-0 { transform: translateX(-50%) !important; opacity: 1 !important; z-index: 2; left: 50% !important; }
      .img-card-1 { display: none; }
      .img-card-2 { display: none; }
      .benefit-item { gap: 12px; flex-direction: column; align-items: center; text-align: center; }
      .benefit-icon { width: 40px; height: 40px; font-size: 20px; margin: 0 auto; }
      .benefit-title { font-size: 14px; }
      .benefit-desc { font-size: 13px; }
      .benefit-list { text-align: center; }
      .why-locaura-desc { font-size: 14px; }
      
      .stats-inner { padding: 30px 16px; grid-template-columns: 1fr; text-align: center; }
      .stat { padding: 20px 0; text-align: center; }
      .stat-icon { font-size: 28px; }
      .stat-value { font-size: 40px; }
      .stat-label { font-size: 13px; }
      
      .features-section { padding: 40px 16px; text-align: center; }
      .features-grid { padding: 0 12px; gap: 16px; }
      .feat-item { padding: 16px; flex-direction: column; text-align: center; align-items: center; }
      .feat-icon { width: 40px; height: 40px; font-size: 20px; margin: 0 auto; }
      .feat-title { font-size: 14px; }
      .feat-desc { font-size: 12px; }
      
      .eco-section { padding: 40px 16px; text-align: center; }
      .eco-grid { grid-template-columns: 1fr; }
      .eco-card { padding: 24px; text-align: center; }
      .eco-icon { width: 56px; height: 56px; font-size: 28px; margin: 0 auto; }
      .eco-name { font-size: 18px; }
      .eco-desc { font-size: 13px; }
      
      .cat-section { padding: 40px 16px; text-align: center; }
      .cat-chips { gap: 10px; justify-content: center; }
      .cat-chip { padding: 10px 20px; font-size: 14px; }
      .cat-chip-icon { font-size: 20px; }
      
      .download-wrap { grid-template-columns: 1fr; gap: 30px; padding: 40px 16px; text-align: center; }
      .download-title { font-size: 32px; }
      .download-sub { font-size: 14px; }
      .qr-card { padding: 24px; }
      .qr-block { width: 150px; height: 150px; margin: 0 auto; }
      
      .nav-links { display: none; }
      .nav { justify-content: space-between; }
      
      .store-btn-zomato { min-width: 100%; }
      .store-btn-dl { min-width: 100%; }
      
      .footer { padding: 40px 16px 20px; text-align: center; }
      .footer-grid { grid-template-columns: 1fr; gap: 24px; text-align: center; }
      .footer-bottom { flex-direction: column; gap: 20px; align-items: center; }
      .footer-countries { justify-content: center; gap: 12px; }
      
      .policy-sidebar-btn { padding: 9px 12px; font-size: 13px; text-align: left; }
      .policy-content { padding: 30px 16px; text-align: left; }
      .policy-sidebar-contact { padding: 14px; text-align: center; }
      
      @keyframes heroFadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    }

    @media (max-width: 375px) {
      .hero-badge { padding: 5px 10px; font-size: 9px; }
      .hero-headline { font-size: 22px; }
      .hero-sub { font-size: 12px; }
      
      .better-wrap { padding: 25px 12px; display: flex; flex-direction: column-reverse; text-align: center; align-items: center; }
      .better-images { height: 220px; flex-shrink: 0; margin: 0 auto; display: flex; justify-content: center; align-items: flex-start; width: 100%; overflow: hidden; }
      .img-card { width: min(90vw, 205px); height: min(62vw, 175px); left: 50% !important; right: auto !important; top: 8px !important; bottom: auto !important; transform: translateX(-50%) !important; }
      .img-card-0 { transform: translateX(-50%) !important; opacity: 1 !important; z-index: 2; left: 50% !important; }
      .img-card-1 { display: none; }
      .img-card-2 { display: none; }
      
      .section-title { font-size: 26px; text-align: center; }
      .section-tag { font-size: 11px; }
      .stats-value { font-size: 32px; }
      
      .benefit-list { gap: 16px; margin-top: 24px; }
      .benefit-item { gap: 10px; padding: 0; }
      .benefit-icon { width: 36px; height: 36px; font-size: 18px; border-radius: 12px; }
      .benefit-title { font-size: 13px; margin-bottom: 2px; }
      .benefit-desc { font-size: 12px; }
      .why-locaura-desc { font-size: 13px; margin-top: 12px; line-height: 1.6; }
      
      .eco-icon { width: 48px; height: 48px; margin: 0 auto; }
      .eco-name { font-size: 16px; }
      .eco-card { text-align: center; }
      .qr-block { width: 130px; height: 130px; margin: 0 auto; }
      .download-title { font-size: 28px; }
      
      .footer { padding: 30px 12px 15px; text-align: center; }
      .footer-grid { gap: 20px; }
      .footer-bottom { gap: 15px; }
    }

    /* ── WAITLIST SECTION BOX ── */
    .waitlist-box {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      padding: 36px 32px;
      max-width: 480px;
      margin: 0 auto;
    }

    /* ────────────────────────────────────────
       POLICY PAGES
    ──────────────────────────────────────── */
    .policy-page { padding-top: 80px; min-height: 100vh; background: #fff; }

    .policy-hero {
      background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #111 100%);
      padding: 80px 80px 70px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .policy-hero::before {
      content: '';
      position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
      width: 800px; height: 800px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,0,0,0.12) 0%, transparent 65%);
      pointer-events: none;
    }
    .policy-hero-icon { font-size: 52px; margin-bottom: 16px; position: relative; z-index: 1; }
    .policy-hero-tag {
      font-size: 11px; font-weight: 800; letter-spacing: 2.5px;
      text-transform: uppercase; color: #EF4444; margin-bottom: 12px;
      position: relative; z-index: 1;
    }
    .policy-hero-title {
      font-size: 56px; font-weight: 900; color: #fff;
      letter-spacing: -2.5px; line-height: 1.05; margin-bottom: 16px;
      position: relative; z-index: 1;
    }
    .policy-hero-sub {
      font-size: 17px; color: rgba(255,255,255,0.45); max-width: 520px;
      margin: 0 auto 20px; line-height: 1.7;
      position: relative; z-index: 1;
    }
    .policy-last-updated {
      display: inline-block; background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12); border-radius: 100px;
      padding: 6px 18px; font-size: 12px; font-weight: 700;
      color: rgba(255,255,255,0.35); letter-spacing: 0.5px;
      position: relative; z-index: 1;
    }

    .policy-layout {
      display: grid; grid-template-columns: 280px 1fr;
      gap: 0; max-width: 100%; align-items: start;
    }

    .policy-sidebar {
      position: sticky; top: 80px; padding: 48px 32px;
      border-right: 1px solid #f0f0f0; min-height: calc(100vh - 80px);
    }
    .policy-sidebar-title {
      font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
      color: #bbb; margin-bottom: 16px;
    }
    .policy-sidebar-btn {
      display: flex; align-items: center; gap: 11px;
      width: 100%; text-align: left; background: none; border: none;
      padding: 11px 14px; border-radius: 12px; cursor: pointer;
      font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700;
      color: #666; transition: all 0.15s; margin-bottom: 4px;
    }
    .policy-sidebar-btn:hover { background: #f7f7f7; color: #111; }
    .policy-sidebar-btn.active { background: #fff2ec; color: #EF4444; }
    .policy-sidebar-icon { font-size: 18px; }
    .policy-sidebar-contact {
      margin-top: 32px; padding: 18px; background: #f9f9f9;
      border-radius: 14px; border: 1px solid #efefef;
    }

    .policy-content { padding: 56px 80px 80px; max-width: 800px; }

    /* ── PROSE POLICY ── */
    .prose-policy {}
    .prose-policy h2 {
      font-size: 20px;
      font-weight: 900;
      color: #111;
      letter-spacing: -0.4px;
      margin-top: 44px;
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
    }
    .prose-policy h2:first-child { margin-top: 0; }
    .prose-policy p {
      font-size: 15px;
      color: #555;
      line-height: 1.85;
      font-weight: 500;
    }

    /* Contact page */
    .contact-cards {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 16px; margin-bottom: 48px;
    }
    .contact-card {
      background: #fafafa; border: 1px solid #f0f0f0;
      border-radius: 20px; padding: 28px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .contact-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.08); }
    .contact-card-icon {
      width: 54px; height: 54px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; margin-bottom: 14px;
    }
    .contact-card-title { font-size: 15px; font-weight: 800; color: #111; margin-bottom: 6px; }
    .contact-card-detail { font-size: 16px; font-weight: 900; margin-bottom: 4px; }
    .contact-card-sub { font-size: 12px; color: #aaa; }

    /* Breadcrumb */
    .policy-breadcrumb {
      display: flex; align-items: center; gap: 8px;
      padding: 16px 80px; background: #fafafa; border-bottom: 1px solid #f0f0f0;
      font-size: 13px; color: #aaa; font-weight: 600;
    }
    .policy-breadcrumb-home {
      color: #EF4444; cursor: pointer; font-weight: 700;
    }
    .policy-breadcrumb-home:hover { text-decoration: underline; }
  `;

  return (
    <>
      <style>{css}</style>

      <SharedNav scrollY={scrollY} onNavigate={navigate} currentPage={currentPage} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* STICKY COUNTDOWN TIMER */}
      {currentPage === "home" && showCountdownInHeader && (
        <div style={{
          position: "fixed",
          top: 70,
          left: 0,
          right: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.95), rgba(0,0,0,0.9))",
          backdropFilter: "blur(10px)",
          padding: "12px 32px",
          textAlign: "center",
          zIndex: 998,
          borderBottom: "1px solid rgba(0,0,0,0.3)",
          animation: "slideDown 0.4s ease",
        }}>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: "0.5px" }}>
            🚀 Launching in Vizag: {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s | {waitlistCount} users waiting
          </div>
        </div>
      )}

      {/* STICKY EMAIL CAPTURE BANNER */}
      {currentPage === "home" && showStickyEmail && (
        <div style={{
          position: "fixed",
          top: 80,
          left: 0,
          right: 0,
          background: "linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.95))",
          padding: "12px 32px",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          animation: "slideDown 0.4s ease",
        }}>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
            Join 10K+ users. Same-day delivery in your city. <strong>Free returns.</strong>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => document.querySelector('.waitlist-box')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: "#fff", color: "#000000", border: "none", padding: "8px 18px", borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
              Join Now
            </button>
            <button onClick={() => setShowStickyEmail(false)} style={{ background: "transparent", color: "#fff", border: "none", cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideInCenter {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* EXIT-INTENT POPUP */}
      {showExitIntent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          animation: "slideInCenter 0.3s ease",
          backdropFilter: "blur(5px)",
          padding: "20px"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #fff 0%, #f8fbff 100%)",
            borderRadius: 24,
            padding: "48px 40px",
            maxWidth: 480,
            textAlign: "center",
            position: "relative",
            boxShadow: "0 25px 80px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.1)",
            border: "1px solid rgba(255,255,255,0.8)",
          }}>
            <button onClick={() => { setShowExitIntent(false); setExitIntentSubmitted(false); setExitIntentEmail(""); setExitIntentPromoCode(""); setExitIntentError(""); }} style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(0,0,0,0.05)",
              border: "none",
              fontSize: 28,
              cursor: "pointer",
              color: "#999",
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              padding: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
            >✕</button>

            {!exitIntentSubmitted ? (
              <>
                <div style={{ 
                  fontSize: 56, 
                  marginBottom: 20,
                  lineHeight: 1,
                  animation: "pulse 0.6s ease-out"
                }}>🚀</div>
                
                <h3 style={{ 
                  fontSize: 28, 
                  fontWeight: 900, 
                  color: "#111", 
                  marginBottom: 12,
                  letterSpacing: "-0.5px"
                }}>Wait! Don't Leave Yet</h3>
                
                <div style={{
                  background: "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.05) 100%)",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 16,
                  padding: "16px 20px",
                  marginBottom: 28,
                }}>
                  <p style={{ 
                    fontSize: 16, 
                    color: "#222",
                    marginBottom: 8,
                    fontWeight: 700,
                    margin: 0
                  }}>Join the waitlist and get free instant delivery on your first order</p>
                </div>
                
                {exitIntentError && (
                  <div style={{ 
                    background: "#fff5f5", 
                    border: "1.5px solid #feb2b2", 
                    color: "#c53030", 
                    padding: "12px 16px", 
                    borderRadius: 12, 
                    marginBottom: 20, 
                    fontSize: 13, 
                    fontWeight: 600
                  }}>
                    ⚠️ {exitIntentError}
                  </div>
                )}
                
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  value={exitIntentEmail}
                  onChange={(e) => setExitIntentEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.form?.querySelector("button[type='button']").click?.();
                    }
                  }}
                  style={{ 
                    display: "block", 
                    width: "100%", 
                    padding: "14px 18px", 
                    borderRadius: 12, 
                    border: "1.5px solid #e2e8f0", 
                    fontSize: 15,
                    fontFamily: "'Nunito', sans-serif",
                    boxSizing: "border-box",
                    marginBottom: 14,
                    transition: "all 0.3s",
                    outline: "none",
                    backgroundColor: "#fff"
                  }}
                  onFocus={(e) => { 
                    e.target.style.borderColor = "#000000"; 
                    e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)";
                  }}
                  onBlur={(e) => { 
                    e.target.style.borderColor = "#e2e8f0"; 
                    e.target.style.boxShadow = "none";
                  }}
                />
                
                <button onClick={async () => {
                  if (!exitIntentEmail) {
                    setExitIntentError("Please enter your email");
                    return;
                  }
                  try {
                    const res = await fetch(`${API_URL}/waitlist`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        name: exitIntentEmail.split("@")[0],
                        email: exitIntentEmail,
                        segment: 'shop',
                        city: 'Vizag'
                      })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setExitIntentPromoCode(data.promoCode);
                      setExitIntentSubmitted(true);
                      setExitIntentError("");
                    } else {
                      setExitIntentError(data.error || "Error registering. Please try again.");
                    }
                  } catch (err) {
                    console.error("Error:", err);
                    setExitIntentError("⚠️ Server not responding. Make sure Node.js backend is running on port 5000.");
                  }
                }} style={{
                  width: "100%",
                  background: "#EF4444",
                  color: "#fff",
                  padding: "14px 24px",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  marginBottom: 12,
                  fontSize: 15,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                }} onMouseEnter={e => { 
                  e.target.style.transform = "translateY(-2px)"; 
                  e.target.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)";
                }} onMouseLeave={e => { 
                  e.target.style.transform = "translateY(0)"; 
                  e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                }}>
                  ✓ Yes, Get first free delivery Now
                </button>
                
                <button onClick={() => setShowExitIntent(false)} style={{
                  width: "100%",
                  background: "transparent",
                  color: "#888",
                  padding: "12px 24px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 15,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => { 
                  e.target.style.borderColor = "#ddd";
                  e.target.style.background = "#f8f8f8";
                }} 
                onMouseLeave={e => { 
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.background = "transparent";
                }}>
                  Not interested
                </button>
              </>
            ) : (
              <>
                <div style={{ 
                  fontSize: 64, 
                  marginBottom: 20,
                  animation: "bounce 0.6s ease"
                }}>🎉</div>
                
                <div style={{ 
                  fontSize: 26, 
                  fontWeight: 900, 
                  color: "#111", 
                  marginBottom: 8
                }}>You're In!</div>
                
                <p style={{ 
                  fontSize: 14, 
                  color: "#666", 
                  marginBottom: 28,
                  lineHeight: 1.5
                }}>Your exclusive ₹first free delivery code is ready. Save it now!</p>
                
                <div style={{
                  background: "linear-gradient(135deg, #fff9f5 0%, #fff5f0 100%)",
                  border: `2px solid #000000`,
                  borderRadius: 16,
                  padding: "20px",
                  marginBottom: 24,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
                }}>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: 10, fontWeight: 600 }}>YOUR PROMO CODE</div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12
                  }}>
                    <div style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#000000",
                      letterSpacing: "2px",
                      fontFamily: "monospace",
                      backgroundColor: "#fff",
                      padding: "12px 16px",
                      borderRadius: 8,
                      flex: 1,
                      border: "1px solid rgba(0,0,0,0.2)"
                    }}>
                      {exitIntentPromoCode}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(exitIntentPromoCode).then(() => {
                          alert("✓ Promo code copied!");
                        });
                      }}
                      style={{
                        background: "#EF4444",
                        color: "#fff",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: 8,
                        fontWeight: 800,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        fontSize: 14
                      }}
                      onMouseEnter={e => { 
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.35)";
                      }}
                      onMouseLeave={e => { 
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div style={{ 
                  background: "rgba(0,0,0,0.06)", 
                  borderRadius: 12, 
                  padding: "18px 16px", 
                  marginBottom: 24,
                  border: "1px solid rgba(0,0,0,0.1)"
                }}>
                  <div style={{ 
                    fontSize: 13, 
                    fontWeight: 900, 
                    color: "#222", 
                    marginBottom: 10 
                  }}>📲 How to Use Your Code:</div>
                  <div style={{ 
                    fontSize: 13, 
                    color: "#555", 
                    lineHeight: 1.7,
                    textAlign: "left"
                  }}>
                    <div style={{ marginBottom: 6 }}>✓ Download the Locaura app</div>
                    <div style={{ marginBottom: 6 }}>✓ Sign up with this email</div>
                    <div style={{ marginBottom: 6 }}>✓ Enter code at checkout</div>
                    <div>✓ Get FREE same-day delivery</div>
                  </div>
                </div>

                <div style={{ 
                  fontSize: 12, 
                  color: "#999", 
                  marginBottom: 20,
                  lineHeight: 1.4
                }}>
                  We'll notify you when the app launches in your area. Keep this code safe!
                </div>

                <button
                  onClick={() => { setShowExitIntent(false); setExitIntentSubmitted(false); setExitIntentEmail(""); setExitIntentPromoCode(""); setExitIntentError(""); }}
                  style={{
                    background: "#EF4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 24px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                  }}
                  onMouseEnter={e => { 
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={e => { 
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                  }}
                >
                  Got it! Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {currentPage === "cities" && <CitiesPage onNavigate={navigate} />}

      {currentPage === "home" && (
        <>
          {/* ── HERO ── */}
          <section className="hero">
            <video className="hero-video" autoPlay loop muted playsInline preload="metadata" style={{ width: '100%', height: '100%' }}>
              <source src={videoBg} type="video/mp4" />
            </video>
            <div className="hero-gradient" />
            <div className="hero-content">
              <div className="hero-badge-group">
                <span className="hero-badge">⭐ Trusted By 10K+ Users</span>
                <span className="hero-badge">✓ 1000+ Verified Stores</span>
                <span className="hero-badge">🔒 100% Secure</span>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8, padding: "10px 18px", marginBottom: 24, display: "inline-block", fontSize: 13, fontWeight: 700, color: "#fff", backdropFilter: "blur(15px)" }}>
                Launching in Vizag in {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
              </div>
              <div className="hero-brand">locaura</div>
              <h1 className="hero-headline">
                Same-Day Delivery from<br />Local Stores Near You
              </h1>
              <p className="hero-sub">
                Fashion, Footwear &amp; Electronics from 1000+ trusted local retailers<br />Delivered to your door in <strong>2 hours</strong> • <strong>Easy Returns</strong> • <strong>Best Prices</strong>
              </p>

              {/* Download buttons */}
              <div className="store-btns">
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="store-btn-zomato store-btn-primary">
                  <GooglePlayIcon />
                  <div className="store-btn-labels"><small>DOWNLOAD NOW</small><strong>Google Play</strong></div>
                </a>
                <button onClick={() => document.querySelector('.waitlist-box')?.scrollIntoView({ behavior: 'smooth' })} className="store-btn-secondary">
                  Join Waitlist
                </button>
              </div>
            </div>
            <div className="scroll-cue"><span>Scroll down</span><span className="scroll-chevron">⌄</span></div>
          </section>

          {/* ── SEGMENT FORMS SECTION ── */}
          <section style={{ padding: "80px 32px", background: "linear-gradient(135deg, #fff9f5 0%, #fff 100%)" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 50 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#000000", letterSpacing: "1px", marginBottom: 8 }}>JOIN OUR NETWORK</div>
                <h2 style={{ fontSize: 40, fontWeight: 900, color: "#111", marginBottom: 16, letterSpacing: "-1px" }}>What brings you here?</h2>
                <p style={{ fontSize: 16, color: "#666", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>Choose your path and join thousands of shoppers, sellers, and delivery partners already using Locaura</p>
              </div>
              
              {/* Segment Tabs */}
              <div style={{ display: "flex", gap: 16, marginBottom: 48, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { id: "shop", icon: "👕", label: "I want to shop" },
                  { id: "sell", icon: "🏪", label: "I want to sell" },
                  { id: "deliver", icon: "🛵", label: "I want to deliver" },
                ].map(seg => (
                  <button
                    key={seg.id}
                    onClick={() => setSelectedSegment(seg.id)}
                    style={{
                      padding: "14px 28px",
                      borderRadius: 14,
                      border: "2.5px solid " + (selectedSegment === seg.id ? "#000000" : "#e0e0e0"),
                      background: selectedSegment === seg.id ? "linear-gradient(135deg, #000000 0%, #000000 100%)" : "#fff",
                      color: selectedSegment === seg.id ? "#fff" : "#111",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: 15,
                      boxShadow: selectedSegment === seg.id ? "0 8px 20px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                    onMouseEnter={e => {
                      if (selectedSegment !== seg.id) {
                        e.target.style.borderColor = "#ddd";
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedSegment !== seg.id) {
                        e.target.style.borderColor = "#e0e0e0";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                      }
                    }}
                  >
                    <span style={{ marginRight: 8 }}>{seg.icon}</span> {seg.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Forms */}
              <div style={{ background: "#fff", borderRadius: 20, padding: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)" }}>
                {/* SHOP SEGMENT */}
                {selectedSegment === "shop" && !segmentFormData.shop.submitted && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = segmentFormData.shop;
                    if (!data.email || !data.city) {
                      setSegmentFormData({ ...segmentFormData, shop: { ...data, error: "Please fill all fields" } });
                      return;
                    }
                    
                    fetch(`${API_URL}/waitlist`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: data.email.split("@")[0],
                        email: data.email,
                        segment: 'shop',
                        city: data.city
                      })
                    })
                    .then(res => res.json())
                    .then(result => {
                      if (result.promoCode) {
                        setSegmentFormData({ ...segmentFormData, shop: { ...data, submitted: true, promoCode: result.promoCode, error: "" } });
                      } else {
                        setSegmentFormData({ ...segmentFormData, shop: { ...data, error: result.error || "Error saving. Try again." } });
                      }
                    })
                    .catch(err => {
                      setSegmentFormData({ ...segmentFormData, shop: { ...data, error: "⚠️ Server error. Make sure backend is running." } });
                    });
                  }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 900, color: "#333", marginBottom: 8, display: "block" }}>
                        Which city are you in?
                      </label>
                      <select 
                        value={segmentFormData.shop.city}
                        onChange={(e) => setSegmentFormData({ ...segmentFormData, shop: { ...segmentFormData.shop, city: e.target.value } })}
                        style={{ 
                          width: "100%", 
                          padding: "12px 16px", 
                          borderRadius: 12, 
                          border: "1.5px solid #e0e0e0", 
                          fontSize: 15,
                          fontFamily: "'Nunito', sans-serif",
                          boxSizing: "border-box",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#000000"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
                      >
                        <option value="">Select a city</option>
                        <option>Mumbai</option>
                        <option>Visakapatnam</option>
                        <option>Bangalore</option>
                        <option>Hyderabad</option>
                        <option>Delhi</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 900, color: "#333", marginBottom: 8, display: "block" }}>
                        Your email
                      </label>
                      <input 
                        type="email" 
                        value={segmentFormData.shop.email}
                        onChange={(e) => setSegmentFormData({ ...segmentFormData, shop: { ...segmentFormData.shop, email: e.target.value } })}
                        placeholder="name@example.com" 
                        style={{ 
                          width: "100%", 
                          padding: "12px 16px", 
                          borderRadius: 12, 
                          border: "1.5px solid #e0e0e0", 
                          fontSize: 15,
                          boxSizing: "border-box",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#000000"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
                        required 
                      />
                    </div>

                    {segmentFormData.shop.error && (
                      <div style={{ background: "#fff5f5", border: "1.5px solid #feb2b2", color: "#c53030", padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
                        ⚠️ {segmentFormData.shop.error}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      style={{ 
                        padding: "14px 24px", 
                        background: "#EF4444", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: 12, 
                        fontWeight: 800, 
                        cursor: "pointer", 
                        transition: "all 0.3s",
                        fontSize: 15,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                      }} 
                      onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)"; }} 
                      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)"; }}
                    >
                      Notify Me When Live 
                    </button>
                  </form>
                )}

                {/* SHOP - SUCCESS */}
                {selectedSegment === "shop" && segmentFormData.shop.submitted && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 56, marginBottom: 20, animation: "bounce 0.6s" }}>🎉</div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 8 }}>You're Registered!</h3>
                    <p style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>Get ₹first free delivery on your first order in Locaura</p>
                    
                    <div style={{ background: "#fff9f5", border: "2px solid #000000", borderRadius: 16, padding: "20px", marginBottom: 24 }}>
                      <div style={{ fontSize: 12, color: "#999", fontWeight: 600, marginBottom: 10 }}>YOUR PROMO CODE</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: "#000000", letterSpacing: "2px", fontFamily: "monospace", flex: 1 }}>
                          {segmentFormData.shop.promoCode}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(segmentFormData.shop.promoCode);
                            alert("✓ Copied!");
                          }}
                          style={{ background: "#EF4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 800, cursor: "pointer", fontSize: 14 }}
                          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; }}
                          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setSegmentFormData({ ...segmentFormData, shop: { city: "", email: "", submitted: false, promoCode: "", error: "" } })}
                      style={{ background: "#f0f0f0", color: "#333", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* SELL SEGMENT */}
                {selectedSegment === "sell" && !segmentFormData.sell.submitted && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = segmentFormData.sell;
                    if (!data.email || !data.shopName || !data.category) {
                      setSegmentFormData({ ...segmentFormData, sell: { ...data, error: "Please fill all fields" } });
                      return;
                    }
                    
                    fetch(`${API_URL}/retailer`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        shopName: data.shopName,
                        category: data.category,
                        email: data.email,
                        segment: 'sell'
                      })
                    })
                    .then(res => res.json())
                    .then(result => {
                      if (result.promoCode) {
                        setSegmentFormData({ ...segmentFormData, sell: { ...data, submitted: true, promoCode: result.promoCode, error: "" } });
                      } else {
                        setSegmentFormData({ ...segmentFormData, sell: { ...data, error: result.error || "Error saving. Try again." } });
                      }
                    })
                    .catch(err => {
                      console.error(err);
                      setSegmentFormData({ ...segmentFormData, sell: { ...data, error: "⚠️ Server error. Make sure backend is running." } });
                    });
                  }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 900, color: "#333", marginBottom: 8, display: "block" }}>
                        Shop Name
                      </label>
                      <input 
                        type="text" 
                        value={segmentFormData.sell.shopName}
                        onChange={(e) => setSegmentFormData({ ...segmentFormData, sell: { ...segmentFormData.sell, shopName: e.target.value } })}
                        placeholder="Your shop name" 
                        style={{ 
                          width: "100%", 
                          padding: "12px 16px", 
                          borderRadius: 12, 
                          border: "1.5px solid #e0e0e0", 
                          fontSize: 15,
                          boxSizing: "border-box",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#000000"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
                        required 
                      />
                    </div>
                    
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 900, color: "#333", marginBottom: 8, display: "block" }}>
                        Category
                      </label>
                      <select 
                        value={segmentFormData.sell.category}
                        onChange={(e) => setSegmentFormData({ ...segmentFormData, sell: { ...segmentFormData.sell, category: e.target.value } })}
                        style={{ 
                          width: "100%", 
                          padding: "12px 16px", 
                          borderRadius: 12, 
                          border: "1.5px solid #e0e0e0", 
                          fontSize: 15,
                          fontFamily: "'Nunito', sans-serif",
                          boxSizing: "border-box",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#000000"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
                      >
                        <option value="">Select category</option>
                        <option>Fashion</option>
                        <option>Footwear</option>
                        <option>Electronics</option>
                        <option>Jewelry</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 900, color: "#333", marginBottom: 8, display: "block" }}>
                        Your email
                      </label>
                      <input 
                        type="email" 
                        value={segmentFormData.sell.email}
                        onChange={(e) => setSegmentFormData({ ...segmentFormData, sell: { ...segmentFormData.sell, email: e.target.value } })}
                        placeholder="name@example.com" 
                        style={{ 
                          width: "100%", 
                          padding: "12px 16px", 
                          borderRadius: 12, 
                          border: "1.5px solid #e0e0e0", 
                          fontSize: 15,
                          boxSizing: "border-box",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#000000"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
                        required 
                      />
                    </div>

                    {segmentFormData.sell.error && (
                      <div style={{ background: "#fff5f5", border: "1.5px solid #feb2b2", color: "#c53030", padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
                        ⚠️ {segmentFormData.sell.error}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      style={{ 
                        padding: "14px 24px", 
                        background: "#EF4444", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: 12, 
                        fontWeight: 800, 
                        cursor: "pointer", 
                        transition: "all 0.3s",
                        fontSize: 15,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                      }} 
                      onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)"; }} 
                      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)"; }}
                    >
                      Partner With Us
                    </button>
                  </form>
                )}

                {/* SELL - SUCCESS */}
                {selectedSegment === "sell" && segmentFormData.sell.submitted && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 56, marginBottom: 20, animation: "bounce 0.6s" }}>🎉</div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 8 }}>Partner Registered!</h3>
                    <p style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>We'll contact you soon with onboarding details</p>
                    
                    <div style={{ background: "#fff9f5", border: "2px solid #000000", borderRadius: 16, padding: "20px", marginBottom: 24 }}>
                      <div style={{ fontSize: 12, color: "#999", fontWeight: 600, marginBottom: 10 }}>YOUR PARTNER ID</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#000000", letterSpacing: "2px", fontFamily: "monospace", flex: 1 }}>
                          {segmentFormData.sell.promoCode}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(segmentFormData.sell.promoCode);
                            alert("✓ Copied!");
                          }}
                          style={{ background: "#EF4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 800, cursor: "pointer", fontSize: 14 }}
                          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; }}
                          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setSegmentFormData({ ...segmentFormData, sell: { shopName: "", category: "", email: "", submitted: false, promoCode: "", error: "" } })}
                      style={{ background: "#f0f0f0", color: "#333", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* DELIVER SEGMENT */}
                {selectedSegment === "deliver" && !segmentFormData.deliver.submitted && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = segmentFormData.deliver;
                    if (!data.email || !data.phone || !data.vehicleType) {
                      setSegmentFormData({ ...segmentFormData, deliver: { ...data, error: "Please fill all fields" } });
                      return;
                    }
                    
                    fetch(`${API_URL}/delivery`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: data.email,
                        phone: data.phone,
                        vehicleType: data.vehicleType,
                        segment: 'deliver'
                      })
                    })
                    .then(res => res.json())
                    .then(result => {
                      if (result.promoCode) {
                        setSegmentFormData({ ...segmentFormData, deliver: { ...data, submitted: true, promoCode: result.promoCode, error: "" } });
                      } else {
                        setSegmentFormData({ ...segmentFormData, deliver: { ...data, error: result.error || "Error saving. Try again." } });
                      }
                    })
                    .catch(err => {
                      console.error(err);
                      setSegmentFormData({ ...segmentFormData, deliver: { ...data, error: "⚠️ Server error. Make sure backend is running." } });
                    });
                  }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 900, color: "#333", marginBottom: 8, display: "block" }}>
                        Vehicle Type
                      </label>
                      <select 
                        value={segmentFormData.deliver.vehicleType}
                        onChange={(e) => setSegmentFormData({ ...segmentFormData, deliver: { ...segmentFormData.deliver, vehicleType: e.target.value } })}
                        style={{ 
                          width: "100%", 
                          padding: "12px 16px", 
                          borderRadius: 12, 
                          border: "1.5px solid #e0e0e0", 
                          fontSize: 15,
                          fontFamily: "'Nunito', sans-serif",
                          boxSizing: "border-box",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#000000"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
                      >
                        <option value="">Select vehicle</option>
                        <option>Two-wheeler</option>
                        <option>Three-wheeler</option>
                        <option>Four-wheeler</option>
                        <option>Bicycle</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 900, color: "#333", marginBottom: 8, display: "block" }}>
                        Phone Number
                      </label>
                      <input 
                        type="tel" 
                        value={segmentFormData.deliver.phone}
                        onChange={(e) => setSegmentFormData({ ...segmentFormData, deliver: { ...segmentFormData.deliver, phone: e.target.value } })}
                        placeholder="9876543210" 
                        style={{ 
                          width: "100%", 
                          padding: "12px 16px", 
                          borderRadius: 12, 
                          border: "1.5px solid #e0e0e0", 
                          fontSize: 15,
                          boxSizing: "border-box",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#000000"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
                        required 
                      />
                    </div>
                    
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 900, color: "#333", marginBottom: 8, display: "block" }}>
                        Your email
                      </label>
                      <input 
                        type="email" 
                        value={segmentFormData.deliver.email}
                        onChange={(e) => setSegmentFormData({ ...segmentFormData, deliver: { ...segmentFormData.deliver, email: e.target.value } })}
                        placeholder="name@example.com" 
                        style={{ 
                          width: "100%", 
                          padding: "12px 16px", 
                          borderRadius: 12, 
                          border: "1.5px solid #e0e0e0", 
                          fontSize: 15,
                          boxSizing: "border-box",
                          transition: "all 0.2s"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#000000"; e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.1)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "#e0e0e0"; e.target.style.boxShadow = "none"; }}
                        required 
                      />
                    </div>

                    {segmentFormData.deliver.error && (
                      <div style={{ background: "#fff5f5", border: "1.5px solid #feb2b2", color: "#c53030", padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
                        ⚠️ {segmentFormData.deliver.error}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      style={{ 
                        padding: "14px 24px", 
                        background: "#EF4444", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: 12, 
                        fontWeight: 800, 
                        cursor: "pointer", 
                        transition: "all 0.3s",
                        fontSize: 15,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
                      }} 
                      onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 30px rgba(0,0,0,0.4)"; }} 
                      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)"; }}
                    >
                      Join as Delivery Partner 🛵
                    </button>
                  </form>
                )}

                {/* DELIVER - SUCCESS */}
                {selectedSegment === "deliver" && segmentFormData.deliver.submitted && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 56, marginBottom: 20, animation: "bounce 0.6s" }}>🎉</div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 8 }}>Partner Registered!</h3>
                    <p style={{ fontSize: 15, color: "#666", marginBottom: 28 }}>We'll contact you soon with onboarding details and earning opportunities</p>
                    
                    <div style={{ background: "#fff9f5", border: "2px solid #000000", borderRadius: 16, padding: "20px", marginBottom: 24 }}>
                      <div style={{ fontSize: 12, color: "#999", fontWeight: 600, marginBottom: 10 }}>YOUR PARTNER ID</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#000000", letterSpacing: "2px", fontFamily: "monospace", flex: 1 }}>
                          {segmentFormData.deliver.promoCode}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(segmentFormData.deliver.promoCode);
                            alert("✓ Copied!");
                          }}
                          style={{ background: "#EF4444", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 800, cursor: "pointer", fontSize: 14 }}
                          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; }}
                          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setSegmentFormData({ ...segmentFormData, deliver: { vehicleType: "", phone: "", email: "", submitted: false, promoCode: "", error: "" } })}
                      style={{ background: "#f0f0f0", color: "#333", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 700, cursor: "pointer", width: "100%" }}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
          <div className="better-wrap" ref={betterRef}>
            <div className="better-images">
              <div className={`img-card img-card-0${betterVisible ? " visible" : ""}`} style={{ width: 290, height: 360, top: 0, left: 0 }}>
                <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format&fit=crop&q=60" alt="clothing" />
              </div>
              <div className={`img-card img-card-1${betterVisible ? " visible" : ""}`} style={{ width: 230, height: 270, bottom: 10, right: 20, zIndex: 2 }}>
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" alt="shoes" />
              </div>
              <div className={`img-card img-card-2${betterVisible ? " visible" : ""}`} style={{ width: 180, height: 210, top: 60, right: 10 }}>
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" alt="watch" />
              </div>
              <div className="floating-badge" style={{ bottom: 130, left: 16 }}>
                <div className="fb-icon">🚚</div>
                <div><div className="fb-title">Delivered in 2 hrs</div><div className="fb-sub">Order placed · Enroute</div></div>
              </div>
            </div>
            <div>
              <div className="section-tag" style={{ fontSize: 30 }}>Why Locaura</div>
              <h2 className="section-title">Better products for<br /><span style={{ color: "teal" }}>more people</span></h2>
              <p className="why-locaura-desc" style={{ fontSize: 19, color: "#888", lineHeight: 1.75, marginTop: 16 }}>
                For years, same-day delivery was only for groceries. We've changed that — bringing fashion, footwear, and electronics from local stores right to your door, in hours.
              </p>
              <div className="benefit-list">
                {benefits.map(b => (
                  <div key={b.title} className="benefit-item">
                    <div className="benefit-icon">{b.icon}</div>
                    <div><div className="benefit-title">{b.title}</div><div className="benefit-desc">{b.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="stats-bar">
            <div className="stats-inner">
              {[
                { icon: "📦", value: "50,000", sup: "+", label: "Products" },
                { icon: "📍", value: "120", sup: "+", label: "Cities", tag: "Coming Soon To" },
                { icon: "", value: "2 hrs", sup: "", label: "Avg Delivery Time" },
              ].map(s => (
                <div key={s.label} className="stat">
                  <div className="stat-icon">{s.icon}</div>
                  {s.tag && <div className="stat-tag">{s.tag}</div>}
                  <div className="stat-value">{s.value}<span>{s.sup}</span></div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FEATURES ── */}
          <div className="features-section">
            <div className="features-header">
              <div className="section-tag">App Features</div>
              <h2 className="section-title">What's waiting for you<br />on the app?</h2>
              <p className="features-sub">Our app is packed with features that enable you to experience retail delivery like never before.</p>
            </div>
            <div className="features-grid">
              <div className="feat-col">
                {features.slice(0, 4).map(f => (
                  <div key={f.title} className="feat-item">
                    <div className="feat-icon">{f.icon}</div>
                    <div><div className="feat-title">{f.title}</div><div className="feat-desc">{f.desc}</div></div>
                  </div>
                ))}
              </div>
              <div className="phone-wrap">
                <div className="phone-screen">
                  <div className="phone-topbar"><span>9:41</span><span>● ● ●</span></div>
                  <div className="phone-brand">Locaura</div>
                  <div className="phone-city">Mumbai · Same-day delivery</div>
                  <div className="phone-search">
                    <span style={{ opacity: 0.5 }}>🔍</span>
                    <span>Search clothes, shoes, gadgets...</span>
                  </div>
                  {[
                    { emoji: "👕", label: "Fashion", sub: "1,200+ items nearby" },
                    { emoji: "👟", label: "Footwear", sub: "840+ pairs in stock" },
                    { emoji: "📱", label: "Electronics", sub: "560+ gadgets available" },
                    { emoji: "⌚", label: "Watches", sub: "300+ in your area" },
                    { emoji: "🎧", label: "Audio", sub: "210+ deals today" },
                  ].map(r => (
                    <div key={r.label} className="phone-row">
                      <span style={{ fontSize: 22 }}>{r.emoji}</span>
                      <div><div className="phone-row-label">{r.label}</div><div className="phone-row-sub">{r.sub}</div></div>
                      <span className="phone-row-arrow">›</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="feat-col">
                {features.slice(4).map(f => (
                  <div key={f.title} className="feat-item">
                    <div className="feat-icon">{f.icon}</div>
                    <div><div className="feat-title">{f.title}</div><div className="feat-desc">{f.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── LIVE WAITLIST COUNTER ── */}
          <section style={{ background: "#EF4444", padding: "40px 32px", textAlign: "center", color: "#fff" }}>
            <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }} > {waitlistCount.toLocaleString()}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>People Already Waiting</div>
            <p style={{ fontSize: 14, marginBottom: 20, opacity: 0.9 }}>Join them and get exclusive early access + ₹first free delivery</p>
            <button onClick={() => document.querySelector('.waitlist-box')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: "#fff", color: "#000000", padding: "12px 28px", border: "none", borderRadius: 8, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
              Join the Waitlist
            </button>
          </section>

          {/* ── FEATURE COMPARISON TABLE ── */}
          <section style={{ padding: "72px 32px", background: "#fff" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: "#111", marginBottom: 12, textAlign: "center" }}>Why Choose Locaura?</h2>
              <p style={{ fontSize: 16, color: "#666", marginBottom: 40, textAlign: "center" }}>The only truly hyperlocal same-day delivery platform</p>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #000000" }}>
                      <th style={{ padding: "16px", textAlign: "left", fontWeight: 900, color: "#111" }}>Feature</th>
                      <th style={{ padding: "16px", textAlign: "center", fontWeight: 900, color: "#000000" }}>Locaura</th>
                      <th style={{ padding: "16px", textAlign: "center", fontWeight: 700, color: "#999" }}>Dunzo</th>
                      <th style={{ padding: "16px", textAlign: "center", fontWeight: 700, color: "#999" }}>Blinkit</th>
                      <th style={{ padding: "16px", textAlign: "center", fontWeight: 700, color: "#999" }}>Flipkart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Same-Day Delivery", locaura: true, dunzo: true, blinkit: true, flipkart: false },
                      { feature: "Local Stores (Fashion)", locaura: true, dunzo: false, blinkit: false, flipkart: false },
                      { feature: "2-Hour Speed", locaura: true, dunzo: false, blinkit: true, flipkart: false },
                      { feature: "Easy Returns", locaura: true, dunzo: false, blinkit: false, flipkart: true },
                      { feature: "Best Local Prices", locaura: true, dunzo: false, blinkit: false, flipkart: false },
                      { feature: "Live Tracking", locaura: true, dunzo: true, blinkit: true, flipkart: true },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #eee", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                        <td style={{ padding: "16px", fontWeight: 700, color: "#111" }}>{row.feature}</td>
                        <td style={{ padding: "16px", textAlign: "center", color: "#000000", fontSize: 18 }}>{row.locaura ? "✓" : "✗"}</td>
                        <td style={{ padding: "16px", textAlign: "center", color: "#999" }}>{row.dunzo ? "✓" : "✗"}</td>
                        <td style={{ padding: "16px", textAlign: "center", color: "#999" }}>{row.blinkit ? "✓" : "✗"}</td>
                        <td style={{ padding: "16px", textAlign: "center", color: "#999" }}>{row.flipkart ? "✓" : "✗"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── PROGRESS INDICATOR & MILESTONE ── */}
          <section style={{ padding: "56px 32px", background: "rgba(14,165,233,0.06)", textAlign: "center" }}>
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 20 }}>You're on the list! 🎉</h3>
              <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>Help us reach our next milestone</p>
              
              <div style={{ background: "#fff", padding: "24px", borderRadius: 16, border: "1.5px solid #ffd5cc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontWeight: 800, color: "#111" }}>Progress to 1,000 Members</span>
                  <span style={{ fontWeight: 800, color: "#000000" }}>{Math.round((waitlistCount / 1000) * 100)}%</span>
                </div>
                <div style={{ width: "100%", height: 12, background: "#f0f0f0", borderRadius: 100, overflow: "hidden", marginBottom: 20 }}>
                  <div style={{ width: `${Math.min(100, (waitlistCount / 1000) * 100)}%`, height: "100%", background: "#EF4444", transition: "width 0.5s ease" }}></div>
                </div>
                <p style={{ fontSize: 13, color: "#111", marginBottom: 8 }}><strong>{waitlistCount} / 1,000 Members</strong></p>
                <p style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>Once we hit 1K, everyone gets exclusive launch day benefits. Help us get there!</p>
                <button onClick={() => {
                  const text = "Join Locaura - Same-day delivery from local stores in Vizag! Get ₹first free delivery.";
                  if (navigator.share) {
                    navigator.share({ title: "Locaura", text, url: "https://locaura.in" }).catch(() => {});
                  } else {
                    const shareURL = "https://locaura.in";
                    navigator.clipboard.writeText(shareURL).then(() => alert("✓ Link copied! Share with friends: " + shareURL)).catch(() => alert(shareURL));
                  }
                }} style={{ background: "#EF4444", color: "#fff", padding: "10px 24px", border: "none", borderRadius: 8, fontWeight: 800, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                   Share
                </button>
              </div>
            </div>
          </section>

          {/* ── RISK REVERSAL SECTION ── */}
          <section style={{ padding: "56px 32px", background: "rgba(14,165,233,0.08)", textAlign: "center" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <h3 style={{ fontSize: 28, fontWeight: 900, color: "#111", marginBottom: 40 }}>100% Risk-Free Guarantee</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
                {[
                  { icon: "", title: "2-Hour Delivery or Free", desc: "If we don't deliver in 2 hours, it's completely free." },
                  { icon: "🔄", title: "24-Hour Easy Returns", desc: "Return anytime, no questions asked. Free pickup." },
                  { icon: "💰", title: "Best Price Guarantee", desc: "Can't find cheaper locally? We'll beat it by ₹50." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#fff", padding: "28px", borderRadius: 16, border: "2px solid #34a853" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                    <h4 style={{ fontSize: 16, fontWeight: 900, color: "#111", marginBottom: 8 }}>{item.title}</h4>
                    <p style={{ fontSize: 14, color: "#666" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── COMPARE WITH COMPETITORS ── */}
          <section style={{ padding: "72px 32px", background: "#fff", textAlign: "center" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: "#111", marginBottom: 40 }}>The Same-Day Fashion Market</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 40 }}>
                {[
                  { title: "Traditional E-com", wording: "3-7 Day Wait", emoji: "📦", color: "#999", isLocaura: false },
                  { title: "Uber/Dunzo", wording: "Only Essentials", emoji: "🛒", color: "#FFB81C", isLocaura: false },
                  { title: "Blinkit/Instamart", wording: "Grocery Only", emoji: "🥦", color: "#00A0DF", isLocaura: false },
                  { title: "Locaura", wording: "Fashion + Speed", color: "#EF4444", isLocaura: true },
                ].map((comp, i) => (
                  <div key={i} style={{ padding: "24px", background: comp.isLocaura ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)" : "#f5f5f5", borderRadius: 16, color: comp.isLocaura ? "#fff" : "#111", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px" }}>
                    {comp.isLocaura ? (
                      <img src={logo} alt="Locaura" style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 12, objectFit: "cover" }} />
                    ) : (
                      <div style={{ fontSize: 40, marginBottom: 12 }}>{comp.emoji}</div>
                    )}
                    <h4 style={{ fontWeight: 900, marginBottom: 8 }}>{comp.title}</h4>
                    <p style={{ fontSize: 14, opacity: 0.9 }}>{comp.wording}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#EF4444", color: "#fff", padding: "32px 24px", borderRadius: 16 }}>
                <p style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>We're the Missing Link</p>
                <p style={{ fontSize: 14, opacity: 0.95 }}>Fast like Blinkit. Fashion like Flipkart. Local like Dunzo.</p>
              </div>
            </div>
          </section>
          <section className="early-access-band">
            <div className="early-access-inner">
              <div className="early-access-eyebrow">🚀 Limited Time Offer</div>
              <h2 className="early-access-title">Get Free Delivery on First Order<br />When You Join Now</h2>
              <p className="early-access-sub">
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 10 }}>
                  ✓ Available in 5 Cities • 120+ Coming Soon
                </span>
                Join the waitlist and get exclusive early access before official launch.
              </p>

              {/* Two CTAs for different user types */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 600, margin: "32px auto 0" }}>
                {/* For Shoppers */}
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>👕</div>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 8 }}>For Shoppers</h3>
                  <button onClick={() => document.querySelector('.waitlist-box')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: "#EF4444", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 800, fontSize: 13, cursor: "pointer", width: "100%", transition: "all 0.2s" }} onMouseEnter={e => { e.target.style.background = "#DC2626"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.target.style.background = "#EF4444"; e.target.style.transform = "translateY(0)"; }}>
                    Join Waitlist
                  </button>
                </div>

                {/* For Retailers/Businesses */}
                <div style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🏪</div>
                  <h3 style={{ fontSize: 14, fontWeight: 900, color: "#fff", marginBottom: 8 }}>For Retailers</h3>
                  <button onClick={() => navigate("contact")} style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "10px 20px", fontWeight: 800, fontSize: 13, cursor: "pointer", width: "100%", transition: "all 0.2s" }} onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.2)"; e.target.style.borderColor = "#fff"; }} onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.12)"; e.target.style.borderColor = "rgba(255,255,255,0.3)"; }}>
                    Partner With Us
                  </button>
                </div>
              </div>

              {/* Waitlist form */}
              <div className="waitlist-box" style={{ marginTop: 40 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
                  Join the Waitlist 🚀
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
                  We'll notify you once our app is live. No spam, ever.
                </div>
                <WaitlistForm dark={true} />
              </div>
            </div>
          </section>

          {/* ── ECOSYSTEM ── */}
          <section className="eco-section">
            <div className="eco-header">
              <div className="section-tag">The Locaura Universe</div>
              <div className="eco-eternal">Our Services</div>
              <div className="eco-sub">Powering India's Changing Shopping Habits</div>
            </div>
            <div className="eco-grid">
              {apps.map(a => (
                <div key={a.name} className="eco-card">
                  <div className="eco-icon" style={{ background: a.bg }}>
                    {a.image ? <img src={a.image} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }} /> : a.icon}
                  </div>
                  <div className="eco-tag">{a.tag}</div>
                  <div className="eco-name">{a.name}</div>
                  <div className="eco-desc">{a.desc}</div>
                  <div className="eco-link">Check it out <span style={{ fontSize: 20 }}>›</span></div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CATEGORIES ── */}
          <section className="cat-section">
            <div className="section-tag">Browse by Category</div>
            <h2 className="section-title">Everything you need,<br />delivered today</h2>
            <div className="cat-chips">
              {categories.map(c => (
                <div key={c.label} className="cat-chip">
                  <span className="cat-chip-icon">{c.emoji}</span>{c.label}
                </div>
              ))}
            </div>
          </section>

          {/* ── TRUST & SAFETY SECTION ── */}
          <section style={{ background: "linear-gradient(135deg, #030712 0%, #0F172A 100%)", padding: "80px 32px", textAlign: "center" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <div style={{ marginBottom: 60 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#EF4444", letterSpacing: "2px", marginBottom: 12, textTransform: "uppercase" }}>Security & Compliance</div>
                <h2 style={{ fontSize: 42, fontWeight: 900, color: "#fff", marginBottom: 16, letterSpacing: "-1px" }}>Your Trust Matters</h2>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto" }}>Built with industry-leading security, compliance, and customer protection</p>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28, marginBottom: 20 }}>
                {[
                  { label: "RBI Approved Payment", sub: "Razorpay & NPCI Certified Gateway" },
                  { label: "256-Bit SSL Encryption", sub: "Bank-Grade Security Standard" },
                  { label: "GST Compliant", sub: "Fully Legal & Documented Operations" },
                  { label: "Consumer Protection", sub: "E-Commerce Rules 2020 Compliant" },
                  { label: "Registered Entity", sub: "Licensed & DPIIT Recognized Startup" },
                  { label: "Verified Retailers", sub: "100% Authentic & Documented Sellers" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "32px 24px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 16, transition: "all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"; e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"; e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#EF4444", letterSpacing: "1px", marginBottom: 8, textTransform: "uppercase" }}>Certified</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ SECTION ── */}
          <section style={{ padding: "72px 32px", background: "#fafafa" }}>
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 56 }}>
                <div className="section-tag">Questions?</div>
                <h2 className="section-title">Frequently Asked Questions</h2>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { q: "Is it really same-day delivery?", a: "Yes! If you order before 2 PM, we deliver by evening. For cities with sufficient demand, we offer 2-hour express delivery." },
                  { q: "How is Locaura different from other apps?", a: "We partner directly with local stores, giving you genuine inventory + best prices. No fake discounts, no warehouses — real products from verified retailers near you." },
                  { q: "What about returns?", a: "Easy returns within 24 hours. Just raise a return request in the app & we'll pick it up from your door. No questions, no hassle." },
                  { q: "Is payment safe?", a: "100% secure. We use industry-leading encryption & partner with trusted payment gateways like Razorpay. Your data is protected." },
                  { q: "Which cities are you in?", a: "Currently live in Mumbai, Bangalore, Hyderabad & more. Coming soon to 120+ cities across India." },
                ].map((faq, i) => (
                  <details key={i} style={{ background: "#fff", padding: "16px 20px", borderRadius: 12, border: "1px solid #e0e0e0", cursor: "pointer" }}>
                    <summary style={{ fontSize: 15, fontWeight: 800, color: "#111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {faq.q}
                      <span style={{ fontSize: 20 }}>›</span>
                    </summary>
                    <p style={{ fontSize: 14, color: "#666", marginTop: 12, lineHeight: 1.6 }}>{faq.a}</p>
                  </details>
                ))}
              </div>

              <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(14,165,233,0.06)", borderRadius: 12, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "#333", marginBottom: 12 }}>Still have questions?</p>
                <a href="mailto:support@locaura.in" style={{ color: "#000000", fontWeight: 800, textDecoration: "none" }}>
                  Email us → support@locaura.in
                </a>
              </div>
            </div>
          </section>

          {/* ── DOWNLOAD ── */}
          <div className="download-wrap">
            <div>
              <div className="section-tag">Get the App</div>
              <h2 className="download-title">Download the<br />app <span>now!</span></h2>
              <p className="download-sub">Experience seamless same-day shopping on the Locaura app.<br />Available on Android — free to download.</p>
              <div className="store-btns" style={{ justifyContent: "flex-start" }}>
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="store-btn-dl">
                  <GooglePlayIcon />
                  <div className="store-btn-labels"><small>GET IT ON</small><strong>Google Play</strong></div>
                </a>
              </div>
            </div>
            <div className="qr-card">
              <div className="qr-label">Scan the QR code to download the app</div>
              <div className="qr-block">
                <svg width="160" height="160" viewBox="0 0 110 110">
                  {[...Array(11)].map((_, r) =>
                    [...Array(11)].map((_, c) => {
                      const val = ((r * 13 + c * 7 + r * c) % 3) === 0;
                      const isFinder = (r < 4 && c < 4) || (r < 4 && c > 6) || (r > 6 && c < 4);
                      return (val || isFinder) ? (
                        <rect key={`${r}-${c}`} x={c * 10} y={r * 10} width={9} height={9} fill={isFinder ? "#000000" : "#fff"} rx={1.5} />
                      ) : null;
                    })
                  )}
                </svg>
              </div>
              <div className="qr-pill">
                <span style={{ fontSize: 28 }}></span>
                <div><div className="qr-pill-name">Locaura</div><div className="qr-pill-sub">Same-Day Delivery App</div></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── POLICY PAGES ── */}
      {currentPage !== "home" && currentPage !== "cities" && (
        <div className="policy-breadcrumb">
          <span className="policy-breadcrumb-home" onClick={() => navigate("home")}>🏠 Home</span>
          <span>›</span>
          <span style={{ color: "#000000" }}>
            {allPolicies.find(p => p.page === currentPage)?.label || "Policy"}
          </span>
        </div>
      )}

      {currentPage === "terms" && <TermsPage onNavigate={navigate} allPolicies={allPolicies} />}
      {currentPage === "privacy" && <PrivacyPage onNavigate={navigate} allPolicies={allPolicies} />}
      {currentPage === "refund" && <RefundPage onNavigate={navigate} allPolicies={allPolicies} />}
      {currentPage === "delivery" && <DeliveryPage onNavigate={navigate} allPolicies={allPolicies} />}
      {currentPage === "seller" && <SellerPage onNavigate={navigate} allPolicies={allPolicies} />}
      {currentPage === "delivery-partner" && <DeliveryPartnerPage onNavigate={navigate} allPolicies={allPolicies} />}
      {currentPage === "contact" && <ContactPage onNavigate={navigate} allPolicies={allPolicies} />}

      {currentPage !== "cities" && <SharedFooter onNavigate={navigate} />}
      {currentPage === "cities" && <SharedFooter onNavigate={navigate} />}
    </>
  );
}
