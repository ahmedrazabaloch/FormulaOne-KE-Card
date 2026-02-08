import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config/firebase";
import CreateCard from "./pages/CreateCard";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification";
import Loader from "./components/Loader";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard"); // Start with dashboard
  const [cachedCards, setCachedCards] = useState(null); // Cache cards data
  const [editingCard, setEditingCard] = useState(null); // Card being edited
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigateToCreate = () => {
    setEditingCard(null);
    // Clear localStorage when creating new card
    localStorage.removeItem("employeeData");
    localStorage.removeItem("vehicleData");
    setCurrentPage("create");
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setCurrentPage("create");
  };

  const handleCardCreated = () => {
    // Invalidate cache when new card is created
    setCachedCards(null);
    setEditingCard(null);
    setCurrentPage("dashboard");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage("dashboard");
      setCachedCards(null);
      setEditingCard(null);
    } catch {
      // Logout error handled silently
    }
  };

  const handleLoginSuccess = () => {
    setCurrentPage("dashboard");
  };

  // Show loader while checking auth
  if (authLoading) {
    return (
      <NotificationProvider>
        <>
          <Loader message="Loading..." />
          <Notification />
        </>
      </NotificationProvider>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return (
      <NotificationProvider>
        <>
          <Login onLoginSuccess={handleLoginSuccess} />
          <Notification />
        </>
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <>
        {currentPage === "dashboard" ? (
          <Dashboard 
            onNavigateToCreate={handleNavigateToCreate}
            cachedCards={cachedCards}
            setCachedCards={setCachedCards}
            onEditCard={handleEditCard}
            onLogout={handleLogout}
            user={user}
          />
        ) : (
          <CreateCard 
            onNavigateToDashboard={handleNavigateToDashboard}
            onCardCreated={handleCardCreated}
            editingCard={editingCard}
            onLogout={handleLogout}
            user={user}
          />
        )}
        <Notification />
      </>
    </NotificationProvider>
  );
}

export default App;
