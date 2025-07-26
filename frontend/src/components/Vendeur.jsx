import React, { useState, useEffect } from "react";

// Vos icônes (assurez-vous qu'elles sont correctement importées ou définies)
const FaPlus = () => <span style={{ marginRight: "5px" }}>➕</span>;
const FaEdit = () => <span style={{ marginRight: "5px" }}>✏️</span>;
const FaTrash = () => <span style={{ marginRight: "5px" }}>🗑️</span>;
const FaSave = () => <span style={{ marginRight: "5px" }}>💾</span>;
const FaTimes = () => <span style={{ marginRight: "5px" }}>❌</span>;
const FaImage = () => <span style={{ marginRight: "5px" }}>🖼️</span>;
const FaLeaf = () => <span style={{ marginRight: "5px" }}>🌿</span>;

const Vendeur = () => {
  const [produits, setProduits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [currentTab, setCurrentTab] = useState("produits"); // Onglet sélectionné

  // L'URL de votre backend Spring Boot
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    description: "",
    prix: "",
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null); // État pour le fichier image

  // Vos types de produits et couleurs
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
  const colors = {
    primary: "#0A400C",
    secondary: "#5CB338",
    light: "#F8F8F8",
    dark: "#1A1A1A",
    accent: "#2D5016",
    text: "#333333",
    background: "#FFFFFF",
  };

  // Charger les produits depuis le backend au démarrage
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/produits`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProduits(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Stocker le fichier sélectionné
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Utilisation de FormData pour envoyer des fichiers et du texte
    const data = new FormData();
    data.append("nom", formData.nom);
    data.append("type", formData.type);
    data.append("description", formData.description);
    data.append("prix", formData.prix);
    data.append("stock", formData.stock);
    if (imageFile) {
      data.append("image", imageFile);
    } else if (editingProduct && editingProduct.nomImage) {
      // Si on est en mode édition et qu'aucune nouvelle image n'est sélectionnée,
      // mais qu'il y avait une image existante, on ne la touche pas.
      // Si l'utilisateur veut la supprimer, il faudra un mécanisme dédié.
    }

    try {
      let response;
      if (editingProduct) {
        try {
          const response = await fetch(
            `${API_URL}/api/produits/${editingProduct.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nom: formData.nom,
                type: formData.type,
                description: formData.description,
                prix: formData.prix,
                stock: formData.stock,
              }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `La requête a échoué: ${response.status} - ${errorText}`
            );
          }

          await response.json();
          fetchProducts();
          resetForm();
        } catch (error) {
          console.error("Erreur lors de la modification du produit:", error);
          alert(
            "Une erreur est survenue lors de la modification du produit. Détails: " +
              error.message
          );
        }
        return;
      } else {
        // Ajout (POST request)
        response = await fetch(`${API_URL}/api/produits`, {
          method: "POST",
          body: data,
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `La requête a échoué: ${response.status} - ${errorText}`
        );
      }

      await response.json(); // Ou response.text() si le backend ne renvoie pas de JSON
      fetchProducts(); // Recharger les produits
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la soumission du produit:", error);
      alert(
        "Une erreur est survenue lors de l'ajout/modification du produit. Détails: " +
          error.message
      );
    }
  };

  const resetForm = () => {
    setFormData({ nom: "", type: "", description: "", prix: "", stock: "" });
    setImageFile(null);
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nom: product.nom,
      type: product.type,
      description: product.description || "",
      prix: product.prix || "",
      stock: product.stock || "",
    });
    setImageFile(null); // Réinitialiser le champ image
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const response = await fetch(`${API_URL}/api/produits/${productId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Échec de la suppression: ${response.status} - ${errorText}`
          );
        }

        fetchProducts(); // Recharger les produits
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert(
          "Une erreur est survenue lors de la suppression du produit. Détails: " +
            error.message
        );
      }
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Ajout d'une fonction pour rafraîchir les commandes
  const fetchCommandes = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/commandes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Erreur lors de la récupération des commandes: ${res.status} - ${errorText}`
        );
        setCommandes([]);
        return;
      }
      const data = await res.json();
      const confirmed = data.filter((c) => c.status === "CONFIRMED");
      const detailed = await Promise.all(
        confirmed.map(async (c) => {
          try {
            const uRes = await fetch(`${API_URL}/api/users/email/${c.acheteur}`, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (uRes.ok) {
              const user = await uRes.json();
              c.userInfo = user;
            }
          } catch (e) {
            console.error(e);
          }
          return c;
        })
      );
      setCommandes(detailed);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      setCommandes([]);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="vendeur-container"
      style={{
        backgroundColor: colors.light,
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: colors.text,
      }}
    >
      <h1
        style={{
          color: colors.primary,
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "2.5rem",
        }}
      >
        Tableau de Bord Vendeur <FaLeaf />
      </h1>

      {/* Onglets navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <button
          onClick={() => setCurrentTab("produits")}
          style={{
            padding: "12px 32px",
            borderRadius: 20,
            border: `2px solid ${colors.primary}`,
            backgroundColor:
              currentTab === "produits" ? colors.primary : colors.background,
            color: currentTab === "produits" ? colors.light : colors.primary,
            fontWeight: 600,
            fontSize: "1.1rem",
            cursor: "pointer",
            boxShadow:
              currentTab === "produits" ? `0 2px 8px ${colors.shadow}` : "none",
            transition: "all 0.2s",
          }}
        >
          Mes Produits
        </button>
        <button
          onClick={() => setCurrentTab("demandes")}
          style={{
            padding: "12px 32px",
            borderRadius: 20,
            border: `2px solid ${colors.primary}`,
            backgroundColor:
              currentTab === "demandes" ? colors.primary : colors.background,
            color: currentTab === "demandes" ? colors.light : colors.primary,
            fontWeight: 600,
            fontSize: "1.1rem",
            cursor: "pointer",
            boxShadow:
              currentTab === "demandes" ? `0 2px 8px ${colors.shadow}` : "none",
            transition: "all 0.2s",
          }}
        >
          Demandes
        </button>
      </div>

      {/* Section stats (optionnelle, toujours visible) */}
      <div
        className="stats-section"
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <div
          className="stat-card"
          style={{
            backgroundColor: colors.background,
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            textAlign: "center",
            minWidth: "200px",
            margin: "10px",
          }}
        >
          <h3 style={{ color: colors.accent, marginBottom: "10px" }}>
            Total Produits
          </h3>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: colors.primary,
            }}
          >
            {produits.length}
          </p>
        </div>
        {/* Ajoutez d'autres cartes de statistiques si nécessaire */}
      </div>

      {/* Affichage conditionnel selon l'onglet sélectionné */}
      {currentTab === "demandes" && (
        // Section commandes
        <div
          style={{
            background: colors.background,
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: 24,
            marginBottom: 32,
            marginTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h2
              style={{
                color: colors.primary,
                fontSize: "1.3rem",
                marginBottom: 0,
              }}
            >
              Demandes reçues
            </h2>
            <button
              onClick={fetchCommandes}
              style={{
                backgroundColor: colors.secondary,
                color: colors.light,
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: `0 2px 8px ${colors.shadow}`,
              }}
            >
              Rafraîchir
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: colors.light }}>
                <th
                  style={{
                    padding: 8,
                    textAlign: "left",
                    color: colors.accent,
                  }}
                >
                  Acheteur
                </th>
                <th
                  style={{
                    padding: 8,
                    textAlign: "left",
                    color: colors.accent,
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: 8,
                    textAlign: "left",
                    color: colors.accent,
                  }}
                >
                  Téléphone
                </th>
                <th
                  style={{
                    padding: 8,
                    textAlign: "left",
                    color: colors.accent,
                  }}
                >
                  Produit
                </th>
                <th
                  style={{
                    padding: 8,
                    textAlign: "left",
                    color: colors.accent,
                  }}
                >
                  Quantité
                </th>
                <th
                  style={{
                    padding: 8,
                    textAlign: "left",
                    color: colors.accent,
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {commandes.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "12px" }}
                  >
                    Aucune commande pour le moment.
                  </td>
                </tr>
              ) : (
                commandes.map((cmd) => (
                  <tr
                    key={cmd.id}
                    style={{ borderBottom: `1px solid ${colors.border}` }}
                  >
                    <td style={{ padding: 8 }}>{cmd.userInfo?.prenom} {cmd.userInfo?.nom}</td>
                    <td style={{ padding: 8 }}>{cmd.userInfo?.email}</td>
                    <td style={{ padding: 8 }}>{cmd.userInfo?.telephone}</td>
                    <td style={{ padding: 8 }}>
                      {cmd.produit?.nom || "Produit inconnu"}
                    </td>
                    <td style={{ padding: 8 }}>{cmd.quantite}</td>
                    <td style={{ padding: 8 }}>
                      {new Date(cmd.date).toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {currentTab === "produits" && (
        // Section gestion des produits
        <div
          className="product-management-section"
          style={{
            backgroundColor: colors.background,
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ color: colors.primary, fontSize: "1.8rem" }}>
              Mes Produits
            </h2>
            <button
              onClick={openAddModal}
              style={{
                backgroundColor: colors.primary,
                color: colors.light,
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaPlus /> Ajouter un Produit
            </button>
          </div>

          <div
            className="product-list"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {produits.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  backgroundColor: colors.light,
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    height: "180px",
                    backgroundColor: "#eee",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "3rem",
                    color: "#aaa",
                    // MODIFICATION ICI : Construire l'URL de l'image depuis le backend Spring Boot
                    backgroundImage: product.nomImage
                      ? `url(${API_URL}/uploads/${product.nomImage})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {!product.nomImage && <FaImage />}
                </div>
                <div style={{ padding: "15px", flexGrow: 1 }}>
                  <h3 style={{ color: colors.primary, marginBottom: "5px" }}>
                    {product.nom}
                  </h3>
                  <p
                    style={{
                      color: colors.accent,
                      fontSize: "0.9rem",
                      marginBottom: "10px",
                    }}
                  >
                    {product.type}
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: colors.text,
                      marginBottom: "10px",
                    }}
                  >
                    {product.description}
                  </p>
                  <p
                    style={{
                      fontWeight: "bold",
                      color: colors.dark,
                      marginBottom: "5px",
                    }}
                  >
                    Prix: {product.prix} Dh
                  </p>
                  <p style={{ color: colors.text }}>Stock: {product.stock}</p>
                </div>
                <div
                  style={{
                    padding: "15px",
                    borderTop: `1px solid ${colors.secondary}`,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.dark,
                      padding: "8px 12px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaEdit /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      backgroundColor: "#dc3545", // Rouge pour supprimer
                      color: colors.light,
                      padding: "8px 12px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaTrash /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: colors.background,
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              width: "90%",
              maxWidth: "500px",
              position: "relative",
            }}
          >
            <h2
              style={{
                color: colors.primary,
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {editingProduct
                ? "Modifier le Produit"
                : "Ajouter un Nouveau Produit"}
            </h2>
            <button
              onClick={resetForm}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: colors.text,
              }}
            >
              <FaTimes />
            </button>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                >
                  Nom du Produit
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: colors.light,
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                >
                  Type de Produit
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: colors.light,
                  }}
                >
                  <option value="">Sélectionner un type</option>
                  {typesProduits.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* MODIFICATION : Champ pour l'image */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                >
                  Image du produit
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/webp" // Accepter certains formats d'image
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: colors.light,
                  }}
                />
                {/* Afficher l'image actuelle lors de la modification */}
                {editingProduct && editingProduct.nomImage && !imageFile && (
                  <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <p style={{ color: colors.text, marginBottom: "5px" }}>
                      Image actuelle :
                    </p>
                    <img
                      src={`${API_URL}/uploads/${editingProduct.nomImage}`}
                      alt={editingProduct.nom}
                      style={{
                        maxWidth: "150px",
                        maxHeight: "150px",
                        borderRadius: "8px",
                        border: `1px solid ${colors.secondary}`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: colors.light,
                    resize: "vertical",
                  }}
                ></textarea>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                >
                  Prix (€)
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: colors.light,
                  }}
                />
              </div>
              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: colors.primary,
                  }}
                >
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: colors.light,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    backgroundColor: "#6c757d",
                    color: colors.light,
                    padding: "12px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    color: colors.light,
                    padding: "12px 20px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaSave /> {editingProduct ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section contact en bas */}
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

export default Vendeur;
