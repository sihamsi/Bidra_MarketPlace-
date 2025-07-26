import React, { useState, useEffect } from "react";

// Palette premium pour les couleurs de l'UI
const colors = {
  primary: "#0A400C", // Vert foncé pour les éléments principaux
  secondary: "#5CB338", // Vert plus clair pour les accents
  accent: "#2D5016", // Vert encore plus foncé pour les détails
  light: "#F8F8F8", // Gris très clair pour les fonds légers
  dark: "#1A1A1A", // Noir pour le texte ou les fonds sombres
  background: "#FFFFFF", // Blanc pur pour le fond de page
  card: "#FAFAFA", // Gris très clair pour les cartes produits
  border: "#E0E0E0", // Gris clair pour les bordures
  shadow: "rgba(10,64,12,0.08)", // Ombre légère basée sur la couleur primaire
};

// URL de l'API backend
const API_URL = process.env.REACT_APP_API_URL;

// Liste des types de produits pour les filtres
const typesProduits = [
  "Semences",
  "Engrais",
  "Pesticides",
  "Biostimulants",
  "Outils agricoles",
  "Machines agricoles",
  "Charrues",
  "Systèmes d'irrigation",
  "Produits phytosanitaires",
];

// IMAGES AGRICULTURE pour le carrousel
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

// Icônes (simulées avec des caractères Unicode pour éviter les dépendances externes)
const FaSearch = () => <span style={{ fontSize: "1.2em" }}>🔍</span>;
const FaShoppingCart = () => <span style={{ fontSize: "1.2em" }}>🛒</span>;
const FaUser = () => <span style={{ fontSize: "1.2em" }}>👤</span>;
const FaCheck = () => <span style={{ fontSize: "1.2em" }}>✅</span>;
const FaTrash = () => <span style={{ fontSize: "1.2em" }}>🗑️</span>;
const FaMinus = () => <span style={{ fontSize: "1.2em" }}>➖</span>;
const FaPlus = () => <span style={{ fontSize: "1.2em" }}>➕</span>;
const FaTimes = () => <span style={{ fontSize: "1.2em" }}>❌</span>;
const FaImage = () => <span style={{ fontSize: "2em", opacity: 0.2 }}>🖼️</span>; // Icône pour image manquante

const Client = () => {
  // États pour la gestion des produits et du filtrage
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // États pour le panier et sa visibilité
  const [panier, setPanier] = useState([]);
  const [showPanier, setShowPanier] = useState(false);

  // États pour l'authentification de l'utilisateur
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Stocke les infos de l'utilisateur connecté

  // État pour le chargement des données
  const [loading, setLoading] = useState(true);

  // États pour le carrousel
  const [carouselIndex, setCarouselIndex] = useState(0);

  // État pour la confirmation visuelle (toast/snackbar)
  const [confirmation, setConfirmation] = useState("");

  // État pour gérer les quantités sélectionnées par produit avant ajout au panier
  const [quantites, setQuantites] = useState({}); // { [productId]: quantite }

  // État pour afficher la section "Mes achats"
  const [showMesAchats, setShowMesAchats] = useState(false);
  const [mesAchats, setMesAchats] = useState([]);

  // État pour gérer la navigation
  const [currentPage, setCurrentPage] = useState("accueil");

  // État pour gérer la vue actuelle
  const [currentView, setCurrentView] = useState("clientProducts");

  // État pour afficher le prompt de connexion
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Effet pour le défilement automatique du carrousel
  useEffect(() => {
    const timer = setTimeout(() => {
      setCarouselIndex((carouselIndex + 1) % carrouselImages.length);
    }, 4000); // Change d'image toutes les 4 secondes
    return () => clearTimeout(timer); // Nettoyage du timer
  }, [carouselIndex]);

  // Effet pour charger les produits et le panier au démarrage
  useEffect(() => {
    fetchProducts(); // Récupère les produits
    const savedPanier = localStorage.getItem("panier");
    if (savedPanier) {
      setPanier(JSON.parse(savedPanier)); // Charge le panier depuis le localStorage
    }

    // Vérifie l'authentification de l'utilisateur (simulé ici)
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); // Récupère le nom d'utilisateur
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser)); // Parse le nom d'utilisateur
    }
    setLoading(false); // Fin du chargement initial
  }, []);

  // Effet pour sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(panier));
  }, [panier]);

  // Effet pour filtrer les produits lorsque le terme de recherche ou le type sélectionné change
  useEffect(() => {
    let currentFiltered = produits.filter((produit) =>
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedType) {
      currentFiltered = currentFiltered.filter(
        (produit) => produit.type === selectedType
      );
    }
    setFilteredProduits(currentFiltered);
  }, [searchTerm, selectedType, produits]);

  // Fonction pour récupérer les produits depuis l'API
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/produits`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProduits(data);
      setFilteredProduits(data); // Initialise les produits filtrés
      // Initialise les quantités à 1 pour chaque produit
      const initialQuantites = {};
      data.forEach((p) => (initialQuantites[p.id] = 1));
      setQuantites(initialQuantites);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    }
  };

  // Fonction pour récupérer les commandes de l'utilisateur
  const fetchMesAchats = async () => {
    const acheteur = user?.email;
    const token = localStorage.getItem("token");
    if (!user || !acheteur) {
      setConfirmation("Veuillez vous connecter pour voir vos achats !");
      setTimeout(() => setConfirmation(""), 2000);
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/commandes/acheteur/${acheteur}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMesAchats(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de mes achats:", error);
      setMesAchats([]);
    }
  };

  // Fonction pour ajouter un produit au panier
  const addToPanier = (product) => {
    const quantiteToAdd = quantites[product.id] || 1; // Utilise la quantité sélectionnée
    if (quantiteToAdd <= 0) {
      setConfirmation("La quantité doit être supérieure à zéro !");
      setTimeout(() => setConfirmation(""), 2000);
      return;
    }
    if (product.stock < quantiteToAdd) {
      setConfirmation("Stock insuffisant !");
      setTimeout(() => setConfirmation(""), 2000);
      return;
    }

    setPanier((prevPanier) => {
      const existingItemIndex = prevPanier.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex > -1) {
        // Si le produit existe déjà, met à jour la quantité
        const updatedPanier = [...prevPanier];
        updatedPanier[existingItemIndex].quantite += quantiteToAdd;
        return updatedPanier;
      } else {
        // Sinon, ajoute le nouveau produit
        return [...prevPanier, { ...product, quantite: quantiteToAdd }];
      }
    });

    // Met à jour le stock affiché localement
    setProduits((prevProduits) =>
      prevProduits.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - quantiteToAdd } : p
      )
    );

    setConfirmation(`"${product.nom}" ajouté au panier !`);
    setTimeout(() => setConfirmation(""), 2000); // Cache le message après 2 secondes
  };

  // Fonction pour supprimer un produit du panier
  const removeFromPanier = (productId) => {
    setPanier((prevPanier) => {
      const itemToRemove = prevPanier.find((item) => item.id === productId);
      if (itemToRemove) {
        // Remet le stock localement
        setProduits((prevProduits) =>
          prevProduits.map((p) =>
            p.id === productId
              ? { ...p, stock: p.stock + itemToRemove.quantite }
              : p
          )
        );
      }
      return prevPanier.filter((item) => item.id !== productId);
    });
  };

  // Fonction pour gérer la commande (envoi au backend)
  const handleCommander = async () => {
    const acheteur = user?.email;
    const token = localStorage.getItem("token");

    if (!isAuthenticated || !acheteur) {
      setShowLoginPrompt(true);
      setConfirmation("Veuillez vous connecter pour commander !");
      setTimeout(() => {
        setConfirmation("");
        setShowLoginPrompt(false);
      }, 2000);
      return;
    }

    if (panier.length === 0) {
      setConfirmation("Votre panier est vide !");
      setTimeout(() => setConfirmation(""), 2000);
      return;
    }

    try {
      await Promise.all(
        panier.map(async (item) => {
          const response = await fetch(`${API_URL}/api/commandes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({
              acheteur: acheteur,
              produitId: item.id,
              quantite: item.quantite,
            }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
      );

      setConfirmation("Commande en cours");
      setPanier([]); // Vide le panier après la commande
      setShowPanier(false); // Ferme le panier modal
      fetchProducts(); // Met à jour les stocks
      if (showMesAchats) {
        fetchMesAchats();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande:", error);
      setConfirmation("Erreur lors de la commande !");
    } finally {
      setTimeout(() => setConfirmation(""), 2000);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Si les données sont en cours de chargement
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5rem",
          color: colors.primary,
        }}
      >
        Chargement...
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: colors.background,
        minHeight: "100vh",
        color: colors.dark,
        paddingTop: "0px", // Pas de padding top car la navbar est dans Interface.jsx
      }}
    >
      {/* Confirmation Toast/Snackbar */}
      {confirmation && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: colors.accent,
            color: colors.light,
            padding: "12px 25px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            fontSize: "0.95rem",
            fontWeight: "bold",
            animation: "fadeInOut 2s forwards",
          }}
        >
          {confirmation}
          {showLoginPrompt && (
            <button
              style={{
                position: "fixed",
                top: 70,
                left: "50%",
                transform: "translateX(-50%)",
                background: colors.secondary,
                color: "#fff",
                border: "none",
                borderRadius: 16,
                padding: "10px 28px",
                fontWeight: 600,
                fontSize: "1.1rem",
                zIndex: 2000,
                boxShadow: `0 2px 8px ${colors.shadow}`,
                cursor: "pointer",
              }}
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-auth-modal"))
              }
            >
              Se connecter
            </button>
          )}
          <style>
            {`
              @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                10% { opacity: 1; transform: translateX(-50%) translateY(0); }
                90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
              }
            `}
          </style>
        </div>
      )}

      {/* Contenu principal de la marketplace */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Barre de recherche et filtres */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "40px",
            padding: "20px",
            backgroundColor: colors.card,
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaSearch
              style={{
                position: "absolute",
                left: "15px",
                color: colors.primary,
              }}
            />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px 12px 45px",
                border: `1px solid ${colors.border}`,
                borderRadius: "25px",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.3s ease",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => setSelectedType("")}
              style={{
                padding: "10px 20px",
                borderRadius: "20px",
                border: `1px solid ${
                  selectedType === "" ? colors.primary : colors.border
                }`,
                backgroundColor:
                  selectedType === "" ? colors.primary : colors.background,
                color: selectedType === "" ? colors.light : colors.dark,
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                boxShadow:
                  selectedType === "" ? `0 2px 8px ${colors.shadow}` : "none",
              }}
            >
              Tous les types
            </button>
            {typesProduits.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "20px",
                  border: `1px solid ${
                    selectedType === type ? colors.primary : colors.border
                  }`,
                  backgroundColor:
                    selectedType === type ? colors.primary : colors.background,
                  color: selectedType === type ? colors.light : colors.dark,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  boxShadow:
                    selectedType === type
                      ? `0 2px 8px ${colors.shadow}`
                      : "none",
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Boutons de navigation pour le client */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <button
            onClick={() => {
              setShowMesAchats(false);
              setShowPanier(false);
            }}
            style={{
              padding: "12px 25px",
              borderRadius: "25px",
              border: `1px solid ${colors.primary}`,
              backgroundColor:
                !showMesAchats && !showPanier
                  ? colors.primary
                  : colors.background,
              color:
                !showMesAchats && !showPanier ? colors.light : colors.primary,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              boxShadow: `0 4px 12px ${colors.shadow}`,
            }}
          >
            Catalogue
          </button>
          <button
            onClick={() => {
              setShowPanier(true);
              setShowMesAchats(false);
            }}
            style={{
              padding: "12px 25px",
              borderRadius: "25px",
              border: `1px solid ${colors.primary}`,
              backgroundColor: showPanier ? colors.primary : colors.background,
              color: showPanier ? colors.light : colors.primary,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              boxShadow: `0 4px 12px ${colors.shadow}`,
            }}
          >
            Mon Panier ({panier.length})
          </button>
          <button
            onClick={() => {
              setShowMesAchats(true);
              setShowPanier(false);
              fetchMesAchats(); // Charge les achats quand le bouton est cliqué
            }}
            style={{
              padding: "12px 25px",
              borderRadius: "25px",
              border: `1px solid ${colors.primary}`,
              backgroundColor: showMesAchats
                ? colors.primary
                : colors.background,
              color: showMesAchats ? colors.light : colors.primary,
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              boxShadow: `0 4px 12px ${colors.shadow}`,
            }}
          >
            Mes Achats
          </button>
        </div>

        {/* Affichage conditionnel du panier ou des produits ou des achats */}
        {showPanier && (
          // Modal Panier
          <div
            style={{
              backgroundColor: colors.card,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              padding: "30px",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                color: colors.primary,
                fontSize: "2rem",
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              Votre Panier
            </h2>
            {panier.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
                Votre panier est vide.
              </p>
            ) : (
              <>
                {panier.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "15px 0",
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={
                          item.nomImage
                            ? `${API_URL}/uploads/${item.nomImage}`
                            : "https://via.placeholder.com/80"
                        }
                        alt={item.nom}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          marginRight: "15px",
                        }}
                      />
                      <div>
                        <h3
                          style={{
                            fontSize: "1.2rem",
                            color: colors.dark,
                            marginBottom: "5px",
                          }}
                        >
                          {item.nom}
                        </h3>
                        <p style={{ color: colors.accent, fontSize: "1rem" }}>
                          {item.prix} DH x {item.quantite}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromPanier(item.id)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#e74c3c",
                        fontSize: "1.5rem",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginTop: "25px",
                    color: colors.primary,
                  }}
                >
                  Total:{" "}
                  {panier
                    .reduce(
                      (total, item) => total + item.prix * item.quantite,
                      0
                    )
                    .toFixed(2)}{" "}
                  DH
                </div>
                <button
                  onClick={handleCommander}
                  style={{
                    width: "100%",
                    padding: "15px",
                    backgroundColor: colors.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginTop: "30px",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                >
                  Confirmer la commande
                </button>
              </>
            )}
          </div>
        )}

        {showMesAchats && (
          // Section Mes Achats
          <div
            style={{
              backgroundColor: colors.card,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              padding: "30px",
              marginBottom: "40px",
            }}
          >
            <h2
              style={{
                color: colors.primary,
                fontSize: "2rem",
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              Mes Achats
            </h2>
            {mesAchats.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
                Vous n'avez pas encore passé de commandes.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                }}
              >
                {mesAchats.map((commande) => (
                  <div
                    key={commande.id}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: "10px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <h3 style={{ color: colors.primary, fontSize: "1.2rem" }}>
                      Commande #{commande.id}
                    </h3>
                    <p>
                      <strong>Produit:</strong>{" "}
                      {commande.produit?.nom || "Produit inconnu"}
                    </p>
                    <p>
                      <strong>Quantité:</strong> {commande.quantite}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(commande.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>
                      <strong>Statut:</strong>{" "}
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            commande.status === "PENDING"
                              ? colors.secondary
                              : colors.accent,
                        }}
                      >
                        {commande.status === "PENDING" || !commande.status
                          ? "Commande en cours"
                          : commande.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!showPanier && !showMesAchats && (
          // Grille de produits
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "30px",
              paddingBottom: "50px",
            }}
          >
            {filteredProduits.length === 0 ? (
              <p
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  color: colors.accent,
                  padding: "50px 0",
                }}
              >
                Aucun produit trouvé pour votre recherche.
              </p>
            ) : (
              filteredProduits.map((product) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: "15px",
                    boxShadow: `0 6px 18px ${colors.shadow}`,
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      height: "200px",
                      backgroundColor: colors.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {product.nomImage ? (
                      <img
                        src={`${API_URL}/uploads/${product.nomImage}`}
                        alt={product.nom}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: "15px",
                          borderTopRightRadius: "15px",
                        }}
                      />
                    ) : (
                      <FaImage style={{ color: colors.border }} />
                    )}
                  </div>
                  <div style={{ padding: "20px", flexGrow: 1 }}>
                    <h3
                      style={{
                        fontSize: "1.4rem",
                        color: colors.primary,
                        marginBottom: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      {product.nom}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: colors.accent,
                        marginBottom: "12px",
                      }}
                    >
                      {product.type}
                    </p>
                    <p
                      style={{
                        fontSize: "1rem",
                        color: colors.dark,
                        marginBottom: "15px",
                        lineHeight: "1.5",
                      }}
                    >
                      {product.description.substring(0, 100)}...
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: "15px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: "bold",
                          color: colors.secondary,
                        }}
                      >
                        {product.prix} DH
                      </span>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          color: product.stock > 0 ? colors.accent : "#e74c3c",
                          fontWeight: "bold",
                        }}
                      >
                        Stock: {product.stock}
                      </span>
                    </div>

                    {/* Contrôle de la quantité */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                      }}
                    >
                      <button
                        onClick={() =>
                          setQuantites((q) => ({
                            ...q,
                            [product.id]: Math.max(1, (q[product.id] || 1) - 1),
                          }))
                        }
                        style={{
                          backgroundColor: colors.light,
                          border: `1px solid ${colors.border}`,
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          color: colors.primary,
                          transition: "background-color 0.2s",
                        }}
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        value={quantites[product.id] || 1}
                        onChange={(e) =>
                          setQuantites((q) => ({
                            ...q,
                            [product.id]: Math.max(
                              1,
                              parseInt(e.target.value) || 1
                            ),
                          }))
                        }
                        min="1"
                        style={{
                          width: "60px",
                          textAlign: "center",
                          padding: "5px",
                          borderRadius: "5px",
                          border: `1px solid ${colors.border}`,
                          fontSize: "1rem",
                        }}
                      />
                      <button
                        onClick={() =>
                          setQuantites((q) => ({
                            ...q,
                            [product.id]: (q[product.id] || 1) + 1,
                          }))
                        }
                        style={{
                          backgroundColor: colors.light,
                          border: `1px solid ${colors.border}`,
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "1.2rem",
                          color: colors.primary,
                          transition: "background-color 0.2s",
                        }}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <button
                      onClick={() => addToPanier(product)}
                      disabled={product.stock <= 0}
                      style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor:
                          product.stock > 0 ? colors.primary : colors.border,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        cursor: product.stock > 0 ? "pointer" : "not-allowed",
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      {product.stock > 0
                        ? "Ajouter au panier"
                        : "Rupture de stock"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Contact section at the bottom */}
      <div
        id="contact"
        style={{
          background: colors.card,
          padding: 40,
          marginTop: 60,
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <h2 style={{ color: colors.primary, marginBottom: 12 }}>Contact</h2>
        <p style={{ color: colors.accent, fontSize: "1.1rem" }}>
          Pour toute question, contactez-nous à{" "}
          <a
            href="mailto:contact@bidra.com"
            style={{ color: colors.secondary, textDecoration: "underline" }}
          >
            contact@bidra.com
          </a>
        </p>
        <p style={{ color: colors.accent, fontSize: "1.1rem" }}>
          Téléphone : +212 6 00 00 00 00
        </p>
      </div>
    </div>
  );
};

export default Client;
