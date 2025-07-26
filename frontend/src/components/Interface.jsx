import React, { useState, useEffect, useMemo } from "react";
import Vendeur from "./Vendeur";
import Client from "./Client";
import Admin from "./Admin";
import Navbar from "../Navbar";
import Footer from "../Footer";

const API_URL = process.env.REACT_APP_API_URL;

const FaLeaf = () => <span>🌿</span>;
const FaTractor = () => <span>🚜</span>;
const FaChartLine = () => <span>📈</span>;
const FaUserTie = () => <span>👔</span>;
const FaTruck = () => <span>🚚</span>;
const FaHandshake = () => <span>🤝</span>;
const FaArrowRight = () => <span>→</span>;
const FaUserCircle = () => <span>👤</span>;
const FaShoppingBag = () => <span>🛍️</span>;
const FaSignOutAlt = () => <span>🚪</span>;
const FaCog = () => <span>⚙️</span>;
const FaUsers = () => <span>👥</span>;
const FaChartBar = () => <span>📊</span>;
const IoIosArrowForward = () => <span>›</span>;

const Interface = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentSeason, setCurrentSeason] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [confirmation, setConfirmation] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const colors = useMemo(
    () => ({
      primary: "#0A400C",
      secondary: "#5CB338",
      light: "#F8F8F8",
      dark: "#1A1A1A",
      accent: "#2D5016",
      text: "#333333",
      background: "#FFFFFF",
      shadow: "rgba(10, 64, 12, 0.1)",
    }),
    []
  );

  const seasons = useMemo(
    () => ({
      winter: {
        months: [12, 1, 2],
        image:
          "https://images.unsplash.com/photo-1518604666860-9ed391f76460?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        title: "Collection Hiver Premium",
        subtitle:
          "Découvrez nos solutions pour protéger vos cultures pendant la saison froide",
      },
      spring: {
        months: [3, 4, 5],
        image:
          "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        title: "Édition Printemps Exceptionnelle",
        subtitle:
          "Préparez vos semis avec nos produits haut de gamme pour une récolte abondante",
      },
      summer: {
        months: [6, 7, 8],
        image:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        title: "Solutions Été Exclusives",
        subtitle:
          "Protégez vos cultures contre la chaleur avec nos technologies innovantes",
      },
      autumn: {
        months: [9, 10, 11],
        image:
          "https://images.unsplash.com/photo-1505259563568-aaaad6b7ef54?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        title: "Collection Automne Luxe",
        subtitle:
          "Optimisez vos récoltes avec notre sélection premium d'outils et conseils",
      },
    }),
    []
  );

  const carrouselImages = [
    {
      url: "https://cdn.futura-sciences.com/cdn-cgi/image/width=1920,quality=50,format=auto/sources/images/agriculture-intensive-champs-tracteur-limite-planetaire.jpeg",
      title: "Champs de blé doré",
      subtitle: "Des récoltes abondantes grâce à des produits de qualité",
    },
    {
      url: "https://maroc-diplomatique.net/wp-content/uploads/2025/04/Agriculture-1.jpg",
      title: "Tracteur moderne",
      subtitle: "L'innovation au service de l'agriculture",
    },
    {
      url: "https://www.intelligentcio.com/africa/wp-content/uploads/sites/5/2019/09/Smart-agriculture.jpg",
      title: "Serres et cultures",
      subtitle: "Des solutions pour tous les professionnels",
    },
    {
      url: "https://sharadpawaragricollege.com/wp-content/uploads/2023/05/agricultural-1-1536x864.jpg",
      title: "Récolte à la main",
      subtitle: "Le respect du savoir-faire agricole",
    },
  ];

  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => {
    if (currentView !== "home") return;
    const timer = setTimeout(() => {
      setCarouselIndex((carouselIndex + 1) % carrouselImages.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [carouselIndex, currentView]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      const storedUser = JSON.parse(userData);
      setUser(storedUser);
      if (storedUser.role === "ADMIN") {
        setCurrentView("admin");
      } else if (storedUser.role === "VENDEUR") {
        setCurrentView("vendeurProducts");
      } else {
        setCurrentView("clientProducts");
      }
    }
    const now = new Date();
    const month = now.getMonth() + 1;
    for (const [season, data] of Object.entries(seasons)) {
      if (data.months.includes(month)) {
        setCurrentSeason(season);
        break;
      }
    }
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const openAuth = () => setShowAuthModal(true);
    window.addEventListener("open-auth-modal", openAuth);
    return () => window.removeEventListener("open-auth-modal", openAuth);
  }, []);

  const handleNavClick = (section) => {
    setCurrentView(section);
  };

  const handleSocialClick = (platform) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Ouverture de ${platform}`);
    }
  };

  const handleAuthClick = () => {
    setShowAuthModal(true);
    setAuthMode("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentView("home");
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          motDePasse: credentials.motDePasse,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowAuthModal(false);
        if (data.user.role === "ADMIN") {
          setCurrentView("admin");
        } else if (data.user.role === "VENDEUR") {
          setCurrentView("vendeurProducts");
        } else {
          setCurrentView("clientProducts");
        }
      } else {
        throw new Error("Erreur de connexion");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    try {
      const mappedUserData = {
        nom: userData.lastName,
        prenom: userData.firstName,
        email: userData.email,
        motDePasse: userData.motDePasse,
        telephone: userData.phone,
        role: userData.role,
      };

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(mappedUserData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur d'inscription");
      }

      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setShowAuthModal(false);
      alert("Inscription réussie !");
      if (data.user.role === "ADMIN") {
        setCurrentView("admin");
      } else if (data.user.role === "VENDEUR") {
        setCurrentView("vendeurProducts");
      } else {
        setCurrentView("clientProducts");
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      alert(error.message || "Erreur d'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const AuthModal = ({
    mode,
    onClose,
    onLogin,
    onRegister,
    onSwitchMode,
    loading,
    colors,
  }) => {
    const [formData, setFormData] = useState({
      email: "",
      motDePasse: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "CLIENT",
    });

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (mode === "login") {
        onLogin({
          email: formData.email,
          motDePasse: formData.motDePasse,
        });
      } else {
        onRegister(formData);
      }
    };

    const getRoleDescription = (role) => {
      switch (role) {
        case "CLIENT":
          return "Acheter des produits agricoles";
        case "VENDEUR":
          return "Vendre des produits agricoles";
        case "ADMIN":
          return "Gérer la plateforme";
        default:
          return "";
      }
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>

          <h2 className="modal-title">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h2>

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <>
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rôle</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="CLIENT">Client</option>
                    <option value="VENDEUR">Vendeur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                  <div className="role-description">
                    {getRoleDescription(formData.role)}
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                name="motDePasse"
                className="form-input"
                value={formData.motDePasse}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="form-button" disabled={loading}>
              {loading
                ? "Chargement..."
                : mode === "login"
                ? "Connexion"
                : "Créer le compte"}
            </button>
          </form>

          <div className="switch-mode">
            {mode === "login" ? (
              <span>
                Pas de compte ? {" "}
                <span
                  className="switch-link"
                  onClick={() => onSwitchMode("register")}
                >
                  Créer un compte
                </span>
              </span>
            ) : (
              <span>
                Déjà un compte ? {" "}
                <span
                  className="switch-link"
                  onClick={() => onSwitchMode("login")}
                >
                  Connexion
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (
      ["portal", "admin", "dashboard"].includes(currentView) &&
      user?.role === "ADMIN"
    ) {
      return <Admin onExit={() => setCurrentView("home")} />;
    }
    if (currentView === "vendeurProducts" && user?.role === "VENDEUR") {
      return <Vendeur />;
    } else if (currentView === "clientProducts" && user?.role === "CLIENT") {
      return <Client />;
    } else if (currentView === "products" && user?.role === "CLIENT") {
      return <Client />;
    } else if (currentView === "products" && user?.role === "VENDEUR") {
      return <Vendeur />;
    } else if (currentView === "products" && !user) {
      return <Client />;
    }

    return (
      <>
        <section
          className="section"
          style={{
            marginTop: -32,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            background: "#fff",
            boxShadow: "0 -8px 32px rgba(10,64,12,0.04)",
            maxWidth: 1400,
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: 48,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ color: colors.primary }}>
                Notre Vision
              </h2>
              <p className="section-subtitle" style={{ color: colors.text }}>
                Bidra réinvente l'accès aux ressources agricoles avec une
                approche premium et professionnelle
              </p>
            </div>

            <div className="features-grid">
              <FeatureCard
                icon={<FaLeaf />}
                title="Intrants de Qualité"
                description="Sélection rigoureuse des meilleurs intrants agricoles pour des rendements optimaux"
                items={[
                  "Semences certifiées",
                  "Engrais haut de gamme",
                  "Produits phytosanitaires premium",
                ]}
                colors={colors}
              />

              <FeatureCard
                icon={<FaTractor />}
                title="Équipements Professionnels"
                description="Machines et outils sélectionnés pour leur performance et durabilité"
                items={[
                  "Tracteurs dernière génération",
                  "Systèmes d'irrigation intelligents",
                  "Outillage professionnel",
                ]}
                colors={colors}
              />

              <FeatureCard
                icon={<FaChartLine />}
                title="Analyses Avancées"
                description="Solutions data-driven pour une agriculture de précision"
                items={[
                  "Analyse de sol détaillée",
                  "Recommandations personnalisées",
                  "Suivi de croissance",
                ]}
                colors={colors}
              />
            </div>
          </div>
        </section>

        <section
          className="section services-section"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <div className="container">
            <div className="section-header">
              <h2 className="section-title" style={{ color: colors.primary }}>
                Nos Services Exclusifs
              </h2>
              <p className="section-subtitle" style={{ color: colors.text }}>
                Une gamme de services premium pour accompagner les
                professionnels de l'agriculture
              </p>
            </div>

            <div className="services-grid">
              <ServiceCard
                icon={<FaUserTie />}
                title="Conseil Personnalisé"
                description="Experts dédiés pour des recommandations sur mesure"
                colors={colors}
              />

              <ServiceCard
                icon={<FaTruck />}
                title="Livraison Premium"
                description="Service logistique haut de gamme avec suivi en temps réel"
                colors={colors}
              />

              <ServiceCard
                icon={<FaHandshake />}
                title="Réseau d'Experts"
                description="Accès à notre réseau de professionnels et fournisseurs triés sur le volet"
                colors={colors}
              />
            </div>
          </div>
        </section>
      </>
    );
  };

  const fetchMesAchats = async () => {
    const acheteur = user?.nom || user?.email || user?.prenom;
    if (!user || !acheteur) {
      setConfirmation("Veuillez vous connecter pour voir vos achats !");
      setTimeout(() => setConfirmation(""), 2000);
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/commandes/acheteur/${acheteur}`
      );
      // ...
    } catch (error) {
      /* ... */
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[DEBUG] user:", user);
      console.log("[DEBUG] showAuthModal:", showAuthModal);
    }
  }, [user, showAuthModal]);

  return (
    <div
      className="app"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <Navbar
        scrolled={scrolled}
        colors={colors}
        user={user}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        handleAuthClick={handleAuthClick}
        handleNavClick={handleNavClick}
        handleLogout={handleLogout}
      />

      {currentView === "home" && (
        <div className="carousel-container">
          {carrouselImages.map((img, idx) => (
            <div
              key={img.url}
              className={`carousel-slide ${idx === carouselIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${img.url})` }}
            >
              <div className="carousel-content">
                <h2>{img.title}</h2>
                <p>{img.subtitle}</p>
              </div>
            </div>
          ))}
          <div className="carousel-indicators">
            {carrouselImages.map((_, idx) => (
              <span
                key={idx}
                className={`indicator ${idx === carouselIndex ? "active" : ""}`}
                onClick={() => setCarouselIndex(idx)}
              />
            ))}
          </div>
        </div>
      )}

      <main className="main-content">{renderMainContent()}</main>

      <Footer 
        colors={colors} 
        handleNavClick={handleNavClick} 
        handleSocialClick={handleSocialClick} 
      />

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSwitchMode={(mode) => setAuthMode(mode)}
          loading={loading}
          colors={colors}
        />
      )}

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: "Poppins", sans-serif;
        }
      `}</style>

      <style jsx>{`
        .app {
          font-family: "Poppins", sans-serif;
          overflow-x: hidden;
          line-height: 1.6;
          color: ${colors.text};
        }

        .main-content {
          margin-top: 80px;
          min-height: calc(100vh - 80px);
        }

        .carousel-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          margin-top: 24px;
          margin-bottom: 0;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 4px 32px ${colors.shadow};
          position: relative;
          min-height: 320px;
          background: #e8f5e9;
        }

        .carousel-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1s;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 320px;
        }

        .carousel-slide.active {
          opacity: 1;
          position: relative;
          z-index: 1;
        }

        .carousel-content {
          background: rgba(10,64,12,0.55);
          border-radius: 24px;
          padding: 36px 48px;
          color: #fff;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 2px 16px ${colors.shadow};
        }

        .carousel-content h2 {
          font-family: "Playfair Display", serif;
          font-weight: 700;
          font-size: 2.2rem;
          margin-bottom: 12px;
        }

        .carousel-content p {
          font-size: 1.2rem;
          opacity: 0.95;
        }

        .carousel-indicators {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 2;
        }

        .indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid ${colors.secondary};
          cursor: pointer;
          transition: background 0.2s;
        }

        .indicator.active {
          background: ${colors.secondary};
        }

        .section {
          padding: 120px 0;
        }

        .services-section {
          padding: 100px 0;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-family: "Playfair Display", serif;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          position: relative;
          display: inline-block;
        }

        .section-title:after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: ${colors.secondary};
        }

        .section-subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
          line-height: 1.8;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: white;
          padding: 50px;
          border-radius: 16px;
          width: 90%;
          max-width: 450px;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          animation: modalFadeIn 0.4s ease-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          color: ${colors.primary};
          transform: rotate(90deg);
        }

        .modal-title {
          font-family: "Playfair Display", serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 30px;
          text-align: center;
          color: ${colors.primary};
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
          display: block;
          margin-bottom: 10px;
          font-weight: 500;
          color: ${colors.primary};
          font-size: 0.95rem;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 14px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: "Poppins", sans-serif;
          background: #f9f9f9;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: ${colors.secondary};
          box-shadow: 0 0 0 2px rgba(92, 179, 56, 0.2);
        }

        .form-button {
          width: 100%;
          padding: 14px;
          background: ${colors.secondary};
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          font-family: "Poppins", sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-button:hover {
          background: ${colors.primary};
          transform: translateY(-2px);
        }

        .form-button:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .switch-mode {
          text-align: center;
          color: ${colors.text};
          margin-top: 20px;
          font-size: 0.95rem;
        }

        .switch-link {
          color: ${colors.secondary};
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .switch-link:hover {
          color: ${colors.primary};
          text-decoration: underline;
        }

        .role-description {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
          font-style: italic;
        }

        @media (max-width: 1200px) {
          .section {
            padding: 100px 0;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2.2rem;
          }
        }

        @media (max-width: 576px) {
          .features-grid,
          .services-grid {
            grid-template-columns: 1fr;
          }

          .section {
            padding: 80px 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .modal-content {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, items, colors }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
    <ul className="feature-list">
      {items.map((item, index) => (
        <li key={index}>
          <span className="feature-bullet">›</span> {item}
        </li>
      ))}
    </ul>

    <style jsx>{`
      .feature-card {
        background-color: ${colors.background};
        border-radius: 16px;
        padding: 40px 30px;
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        position: relative;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.03);
      }
      
      .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.1);
      }
      
      .feature-card::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 0;
        background: ${colors.secondary};
        transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
      }
      
      .feature-card:hover::before {
        height: 100%;
      }
      
      .feature-icon {
        font-size: 2.5rem;
        color: ${colors.secondary};
        margin-bottom: 20px;
      }
      
      .feature-title {
        font-family: "Playfair Display", serif;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: ${colors.primary};
      }
      
      .feature-description {
        color: ${colors.text};
        opacity: 0.8;
        line-height: 1.8;
        margin-bottom: 25px;
      }
      
      .feature-list {
        list-style: none;
      }
      
      .feature-list li {
        padding: 10px 0;
        position: relative;
        padding-left: 30px;
        color: ${colors.text};
        opacity: 0.9;
        transition: all 0.3s ease;
      }
      
      .feature-list li:hover {
        opacity: 1;
        transform: translateX(5px);
      }
      
      .feature-bullet {
        position: absolute;
        left: 0;
        color: ${colors.secondary};
        font-weight: bold;
        font-size: 1.2rem;
      }
    `}</style>
  </div>
);

const ServiceCard = ({ icon, title, description, colors }) => (
  <div className="service-card">
    <div className="service-icon">{icon}</div>
    <h3 className="service-title">{title}</h3>
    <p className="service-description">{description}</p>

    <style jsx>{`
      .service-card {
        background-color: ${colors.background};
        border-radius: 16px;
        padding: 40px 30px;
        text-align: center;
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.03);
      }
      
      .service-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.1);
      }
      
      .service-icon {
        font-size: 2.5rem;
        color: ${colors.secondary};
        margin-bottom: 20px;
      }
      
      .service-title {
        font-family: "Playfair Display", serif;
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 15px;
        color: ${colors.primary};
      }
      
      .service-description {
        color: ${colors.text};
        opacity: 0.8;
        line-height: 1.8;
      }
    `}</style>
  </div>
);

export default Interface;
