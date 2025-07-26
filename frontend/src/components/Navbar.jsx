import React from "react";

const FaUserCircle = () => <span>👤</span>;
const FaShoppingBag = () => <span>🛍️</span>;
const FaSignOutAlt = () => <span>🚪</span>;
const FaChartBar = () => <span>📊</span>;
const FaLeaf = () => <span>🌿</span>;

const Navbar = ({ 
  scrolled, 
  colors, 
  user, 
  showUserMenu, 
  setShowUserMenu, 
  handleAuthClick, 
  handleNavClick, 
  handleLogout 
}) => {
  const getUserMenu = () => {
    if (!user) return [];

    const commonItems = [
      {
        icon: <FaUserCircle />,
        label: "Mon compte",
        onClick: () => handleNavClick("account"),
      },
      {
        icon: <FaSignOutAlt />,
        label: "Déconnexion",
        onClick: handleLogout,
      },
    ];

    if (user.role === "ADMIN") {
      return [
        {
          icon: <FaChartBar />,
          label: "Espace Admin",
          onClick: () => handleNavClick("admin"),
        },
        ...commonItems,
      ];
    }

    if (user.role === "VENDEUR") {
      return [
        {
          icon: <FaShoppingBag />,
          label: "Mes commandes",
          onClick: () => handleNavClick("orders"),
        },
        {
          icon: <FaLeaf />,
          label: "Mes produits",
          onClick: () => handleNavClick("vendeurProducts"),
        },
        ...commonItems,
      ];
    }

    return [
      {
        icon: <FaShoppingBag />,
        label: "Mes commandes",
        onClick: () => handleNavClick("orders"),
      },
      {
        icon: <FaLeaf />,
        label: "Catalogue produits",
        onClick: () => handleNavClick("clientProducts"),
      },
      ...commonItems,
    ];
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <nav className="nav-container">
        <span 
          className="logo" 
          onClick={() => handleNavClick("home")}
        >
          BIDRA
        </span>
        
        <div className="nav-links">
          <button className="nav-link" onClick={() => handleNavClick("home")}>
            Accueil
          </button>
          <button className="nav-link" onClick={() => handleNavClick("products")}>
            Produits
          </button>
          <button className="nav-link" onClick={() => handleNavClick("services")}>
            Services
          </button>
          <button className="nav-link" onClick={() => handleNavClick("expertise")}>
            Expertise
          </button>
          <button className="nav-link" onClick={() => handleNavClick("contact")}>
            Contact
          </button>
        </div>

        {user ? (
          <div className="user-section">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {user.prenom || "Mon compte"}
            </button>
            
            {showUserMenu && (
              <div className="user-menu-dropdown">
                {getUserMenu().map((item) => (
                  <button
                    key={item.label}
                    className="user-menu-item"
                    onClick={() => {
                      item.onClick();
                      setShowUserMenu(false);
                    }}
                  >
                    <span className="menu-item-icon">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={handleAuthClick}>
            Se connecter
          </button>
        )}
      </nav>

      <style jsx>{`
        .header {
          background: ${colors.primary};
          color: #fff;
          box-shadow: ${scrolled ? `0 2px 12px ${colors.shadow}` : "none"};
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 0;
          border-bottom: ${scrolled ? "1px solid rgba(0,0,0,0.05)" : "none"};
        }
        
        .nav-container {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          padding: 18px 0;
          font-family: 'Roboto', sans-serif;
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .logo {
          font-weight: 700;
          font-size: 24px;
          letter-spacing: 2px;
          margin-right: 40px;
          font-family: 'Playfair Display', serif;
          cursor: pointer;
        }
        
        .nav-links {
          display: flex;
          gap: 10px;
        }
        
        .nav-link {
          color: #fff;
          background: none;
          border: none;
          margin: 0 18px;
          font-weight: 500;
          font-size: 1.05rem;
          letter-spacing: 1px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .user-section {
          position: absolute;
          right: 40px;
        }
        
        .user-button, .login-button {
          background: ${colors.secondary};
          color: #fff;
          border: none;
          border-radius: 20px;
          padding: 10px 22px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 2px 8px ${colors.shadow};
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s;
        }
        
        .user-button:hover, .login-button:hover {
          transform: translateY(-2px);
        }
        
        .user-menu-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          background: ${colors.background};
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          padding: 8px 0;
          z-index: 1000;
          min-width: 180px;
        }
        
        .user-menu-item {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          color: ${colors.text};
          cursor: pointer;
        }
        
        .user-menu-item:hover {
          background: ${colors.light};
        }
        
        .menu-item-icon {
          margin-right: 8px;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
