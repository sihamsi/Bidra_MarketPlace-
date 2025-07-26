import React from "react";

const IoIosArrowForward = () => <span>›</span>;

const Footer = ({ colors, handleNavClick, handleSocialClick }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-about">
            <div className="footer-logo">BIDRA</div>
            <p>
              La marketplace premium dédiée aux professionnels de
              l'agriculture moderne. Qualité, expertise et service
              exceptionnel.
            </p>
            <div className="social-links">
              {[
                "facebook-f", "twitter", "linkedin-in", "instagram"
              ].map((social) => (
                <button
                  key={social}
                  className="social-button"
                  onClick={() => handleSocialClick(social)}
                >
                  {social === "facebook-f" && "f"}
                  {social === "twitter" && "t"}
                  {social === "linkedin-in" && "in"}
                  {social === "instagram" && "ig"}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <h3>Navigation</h3>
            <ul>
              {["home", "products", "services", "expertise", "contact"].map(
                (item) => (
                  <li key={item}>
                    <button
                      className="footer-link-button"
                      onClick={() => handleNavClick(item)}
                    >
                      <IoIosArrowForward className="arrow-icon" />
                      {item === "home"
                        ? "Accueil"
                        : item === "products"
                        ? "Produits"
                        : item === "services"
                        ? "Services"
                        : item === "expertise"
                        ? "Expertise"
                        : "Contact"}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="footer-links">
            <h3>Services</h3>
            <ul>
              {[
                "Conseil agricole",
                "Analyse de sol",
                "Formations",
                "Livraison express",
              ].map((item) => (
                <li key={item}>
                  <button
                    className="footer-link-button"
                    onClick={() =>
                      handleNavClick(item.toLowerCase().replace(" ", "-"))
                    }
                  >
                    <IoIosArrowForward className="arrow-icon" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h3>Contact</h3>
            <ul>
              <li>
                <span className="contact-icon">📞</span> +212 6 12 34 56 78
              </li>
              <li>
                <span className="contact-icon">✉️</span> contact@bidra.ma
              </li>
              <li>
                <span className="contact-icon">📍</span> Casablanca, Maroc
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 BIDRA. Tous droits réservés.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: ${colors.primary};
          color: ${colors.light};
          padding: 100px 0 40px;
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 60px;
          margin-bottom: 60px;
        }
        
        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
          display: inline-block;
          color: ${colors.secondary};
        }
        
        .footer-about p {
          opacity: 0.8;
          line-height: 1.8;
          margin-bottom: 25px;
        }
        
        .social-links {
          display: flex;
          gap: 15px;
        }
        
        .social-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: ${colors.light};
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .social-button:hover {
          background: ${colors.secondary} !important;
          transform: translateY(-3px);
        }
        
        .footer-links h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          margin-bottom: 25px;
          position: relative;
          display: inline-block;
        }
        
        .footer-links h3:after {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 2px;
          background: ${colors.secondary};
        }
        
        .footer-links ul {
          list-style: none;
        }
        
        .footer-links li {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        
        .footer-links li:hover {
          opacity: 1;
          transform: translateX(5px);
        }
        
        .footer-link-button {
          background: none;
          border: none;
          color: ${colors.light};
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          text-align: left;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
        }
        
        .arrow-icon {
          color: ${colors.secondary};
        }
        
        .contact-icon {
          color: ${colors.secondary};
          margin-right: 8px;
        }
        
        .footer-bottom {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
          opacity: 0.7;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
