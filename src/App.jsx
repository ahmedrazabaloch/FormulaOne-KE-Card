import { useState } from "react";
import CreateCard from "./pages/CreateCard";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard"); // Start with dashboard

  return (
    <>
      {currentPage === "dashboard" ? (
        <Dashboard onNavigateToCreate={() => setCurrentPage("create")} />
      ) : (
        <CreateCard onNavigateToDashboard={() => setCurrentPage("dashboard")} />
      )}
    </>
  );
}

export default App;
