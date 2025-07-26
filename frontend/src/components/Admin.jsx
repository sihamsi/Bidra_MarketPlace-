import React, { useState, useEffect } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const Admin = ({ onExit }) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [produits, setProduits] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch data
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/users`, { headers: authHeader() })
        .then(r => r.ok ? r.json() : [])
        .catch(() => []),
      fetch(`${API_URL}/api/produits`)
        .then(r => r.ok ? r.json() : [])
        .catch(() => []),
      fetch(`${API_URL}/api/commandes`, { headers: authHeader() })
        .then(r => r.ok ? r.json() : [])
        .catch(() => [])
    ]).then(([usersData, produitsData, commandesData]) => {
      setUsers(usersData);
      setProduits(produitsData);
      setCommandes(commandesData);
      setLoading(false);
    });
  }, []);

  const handleAccept = async (id) => {
    try {
      await fetch(`${API_URL}/api/commandes/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });
      // Refresh commandes
      const response = await fetch(`${API_URL}/api/commandes`, { headers: authHeader() });
      if (response.ok) {
        setCommandes(await response.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onExit) {
      onExit();
    } else {
      window.location.reload();
    }
  };

  // Dashboard Component
  const Dashboard = () => {
    const stats = {
      totalUsers: users.length,
      totalCommandes: commandes.length,
      totalRevenue: commandes.reduce((sum, cmd) => sum + (cmd.total || 0), 0),
      totalProduits: produits.length
    };

    // Chart data
    const ordersByProduct = commandes.reduce((acc, cmd) => {
      const name = cmd.produit?.nom || "Inconnu";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const statusCounts = commandes.reduce((acc, cmd) => {
      acc[cmd.status] = (acc[cmd.status] || 0) + 1;
      return acc;
    }, {});

    const barData = {
      labels: Object.keys(ordersByProduct),
      datasets: [{
        label: "Commandes",
        data: Object.values(ordersByProduct),
        backgroundColor: "rgba(96, 165, 250, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        borderRadius: 8,
      }],
    };

    const pieData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)"
        ],
        borderWidth: 0,
        hoverBorderWidth: 3,
        hoverBorderColor: "#fff"
      }],
    };

    const revenueData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Revenus (€)',
        data: [15000, 23000, 18000, 32000, 28000, stats.totalRevenue],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          padding: 12
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false }
        },
        y: {
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          border: { display: false }
        }
      }
    };

    return (
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Utilisateurs</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Commandes</p>
                <p className="text-3xl font-bold">{stats.totalCommandes}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Revenus</p>
                <p className="text-3xl font-bold">€{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Produits</p>
                <p className="text-3xl font-bold">{stats.totalProduits}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Évolution des revenus</h3>
            <div className="h-80">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>

          {/* Products Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Commandes par produit</h3>
            <div className="h-80">
              <Doughnut data={pieData} options={{
                ...chartOptions,
                cutout: '60%',
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Commandes par produit</h3>
          <div className="h-80">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  };

  // Users Component
  const UsersView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">Gestion des utilisateurs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.prenom} {user.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Products Component
  const ProductsView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">Gestion des produits</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Prix</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produits.map((produit) => (
              <tr key={produit.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{produit.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{produit.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{produit.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    produit.stock > 50 ? 'bg-green-100 text-green-800' : 
                    produit.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {produit.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{produit.prix}€</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Orders Component
  const OrdersView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900">Gestion des commandes</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acheteur</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Produit</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantité</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {commandes.map((commande) => (
              <tr key={commande.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{commande.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{commande.acheteur}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{commande.produit?.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{commande.quantite}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    commande.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                    commande.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {commande.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{commande.total}€</td>
                <td className="px-6 py-4">
                  {commande.status === "PENDING" && (
                    <button
                      onClick={() => handleAccept(commande.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                    >
                      Accepter
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UsersView />;
      case "products":
        return <ProductsView />;
      case "orders":
        return <OrdersView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Administration
          </h2>
          <p className="text-gray-500 text-sm mt-1">Panneau de contrôle</p>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: "dashboard", label: "Tableau de bord", icon: "📊" },
            { id: "users", label: "Utilisateurs", icon: "👥" },
            { id: "products", label: "Produits", icon: "📦" },
            { id: "orders", label: "Commandes", icon: "🛒" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                activeView === item.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <span>🚪</span>
            <span className="font-medium">Déconnexion</span>
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-xl transition-colors"
            >
              <span>👁️</span>
              <span className="font-medium">Quitter</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeView === "dashboard" && "Tableau de bord"}
                {activeView === "users" && "Utilisateurs"}
                {activeView === "products" && "Produits"}
                {activeView === "orders" && "Commandes"}
              </h1>
              <p className="text-gray-500 mt-1">
                {activeView === "dashboard" && "Vue d'ensemble de votre activité"}
                {activeView === "users" && "Gérez les utilisateurs de votre plateforme"}
                {activeView === "products" && "Gérez votre catalogue de produits"}
                {activeView === "orders" && "Suivez et gérez les commandes"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
