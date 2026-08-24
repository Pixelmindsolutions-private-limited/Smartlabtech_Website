import React, { useEffect, useState } from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);

    // GA4 / Meta Pixel can be initialized here
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);

    // Do NOT initialize GA4 / Meta Pixel
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="cookie-overlay">
      <div className="cookie-banner">
        <h2>We value your privacy 🍪</h2>

        <p>
          We use essential cookies to make our website work properly.
          With your permission, we may also use analytics and marketing
          cookies such as Google Analytics and Meta Pixel to understand
          website usage and improve our services.
        </p>

        <div className="cookie-actions">
          <button
            onClick={rejectCookies}
            className="cookie-reject"
          >
            Reject Non-Essential
          </button>

          <button
            onClick={acceptCookies}
            className="cookie-accept"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;