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

// Cache key for sessionStorage
const CARDS_CACHE_KEY = "cachedCardsData";
const CACHE_TIMESTAMP_KEY = "cachedCardsTimestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache validity

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [cachedCards, setCachedCards] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Load cache from sessionStorage on mount
  useEffect(() => {
    try {
      const cachedData = sessionStorage.getItem(CARDS_CACHE_KEY);
      const cacheTimestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cachedData && cacheTimestamp) {
        const timestamp = parseInt(cacheTimestamp, 10);
        const isValid = Date.now() - timestamp < CACHE_DURATION;

        if (isValid) {
          const parsedData = JSON.parse(cachedData);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setCachedCards(parsedData);
          }
        } else {
          // Cache expired, clear it
          sessionStorage.removeItem(CARDS_CACHE_KEY);
          sessionStorage.removeItem(CACHE_TIMESTAMP_KEY);
        }
      }
    } catch (error) {
      console.error("Error loading cache:", error);
    }
  }, []);

  // Update sessionStorage when cache changes
  const updateCache = (cardsData) => {
    setCachedCards(cardsData);
    if (cardsData && Array.isArray(cardsData)) {
      try {
        sessionStorage.setItem(CARDS_CACHE_KEY, JSON.stringify(cardsData));
        sessionStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } catch (error) {
        console.error("Error saving cache:", error);
      }
    }
  };

  // Clear cache
  const clearCache = () => {
    setCachedCards(null);
    sessionStorage.removeItem(CARDS_CACHE_KEY);
    sessionStorage.removeItem(CACHE_TIMESTAMP_KEY);
  };

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
    clearCache();
    setEditingCard(null);
    setCurrentPage("dashboard");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage("dashboard");
      clearCache();
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
          setCachedCards={updateCache}
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
