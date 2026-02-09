import { useState, useEffect, lazy, Suspense } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config/firebase";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification";
import Loader from "./components/Loader";

// Lazy load pages for better performance
const CreateCard = lazy(() => import("./pages/CreateCard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));

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
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleLoginSuccess = () => {
    setCurrentPage("dashboard");
  };

  // Main render logic
  const renderContent = () => {
    if (authLoading) {
      return <Loader message="Loading..." />;
    }

    if (!user) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    if (currentPage === "dashboard") {
      return (
        <Dashboard 
          onNavigateToCreate={handleNavigateToCreate}
          cachedCards={cachedCards}
          setCachedCards={setCachedCards}
          onEditCard={handleEditCard}
          onLogout={handleLogout}
          user={user}
        />
      );
    }

    return (
      <CreateCard 
        onNavigateToDashboard={handleNavigateToDashboard}
        onCardCreated={handleCardCreated}
        editingCard={editingCard}
        onLogout={handleLogout}
        user={user}
      />
    );
  };

  return (
    <NotificationProvider>
      <Suspense fallback={<Loader message="Loading application..." />}>
        {renderContent()}
      </Suspense>
      <Notification />
    </NotificationProvider>
  );
}

export default App;
