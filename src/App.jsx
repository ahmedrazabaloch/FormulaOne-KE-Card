import { useState } from "react";
import CreateCard from "./pages/CreateCard";
import Dashboard from "./pages/Dashboard";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard"); // Start with dashboard
  const [cachedCards, setCachedCards] = useState(null); // Cache cards data
  const [editingCard, setEditingCard] = useState(null); // Card being edited

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

  return (
    <NotificationProvider>
      <>
        {currentPage === "dashboard" ? (
          <Dashboard 
            onNavigateToCreate={handleNavigateToCreate}
            cachedCards={cachedCards}
            setCachedCards={setCachedCards}
            onEditCard={handleEditCard}
          />
        ) : (
          <CreateCard 
            onNavigateToDashboard={handleNavigateToDashboard}
            onCardCreated={handleCardCreated}
            editingCard={editingCard}
          />
        )}
        <Notification />
      </>
    </NotificationProvider>
  );
}

export default App;
