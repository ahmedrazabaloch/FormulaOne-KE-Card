import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import CardPreview from "../components/CardPreview";
import "../styles/dashboard.css";

const Dashboard = ({ onNavigateToCreate }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const cardsRef = collection(db, "cards");
      const q = query(cardsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCards(cardsData);
      setError("");
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError("Failed to load cards. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (card) => {
    setSelectedCard(card);
  };

  const handleClosePreview = () => {
    setSelectedCard(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-GB');
    } catch {
      return "Invalid Date";
    }
  };

  // Filter cards based on search term
  const filteredCards = cards.filter((card) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      card.serialNo?.toLowerCase().includes(search) ||
      card.employeeCode?.toLowerCase().includes(search) ||
      card.employeeName?.toLowerCase().includes(search) ||
      card.cnic?.toLowerCase().includes(search) ||
      card.vehicleNo?.toLowerCase().includes(search) ||
      card.designation?.toLowerCase().includes(search) ||
      card.region?.toLowerCase().includes(search) ||
      card.inspectionId?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>📋 Office Duty Cards</h1>
          <button className="btn-primary" onClick={onNavigateToCreate}>
            ➕ Create New Card
          </button>
        </div>
        <div className="loading">Loading cards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>📋 Office Duty Cards</h1>
          <button className="btn-primary" onClick={onNavigateToCreate}>
            ➕ Create New Card
          </button>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📋 Office Duty Cards</h1>
        <button className="btn-primary" onClick={onNavigateToCreate}>
          ➕ Create New Card
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by Serial No, Name, CNIC, Vehicle No, Employee Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            ✕
          </button>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="empty-state">
          <h2>No cards created yet</h2>
          <p>Click "Create New Card" to get started</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="empty-state">
          <h2>No results found</h2>
          <p>Try a different search term</p>
        </div>
      ) : (
        <div className="cards-table-container">
          <table className="cards-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Serial No</th>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>CNIC</th>
                <th>Vehicle No</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr key={card.id}>
                  <td>
                    {card.photoUrl ? (
                      <img src={card.photoUrl} alt={card.employeeName} className="table-photo" />
                    ) : (
                      <div className="no-photo">📷</div>
                    )}
                  </td>
                  <td>{card.serialNo}</td>
                  <td>{card.employeeCode}</td>
                  <td>{card.employeeName}</td>
                  <td>{card.cnic}</td>
                  <td>{card.vehicleNo}</td>
                  <td>{formatDate(card.createdAt)}</td>
                  <td className="actions">
                    <button 
                      className="btn-view" 
                      onClick={() => handleView(card)}
                      title="View & Download PDF"
                    >
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedCard && (
        <div className="modal-overlay" onClick={handleClosePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CardPreview 
              onClose={handleClosePreview}
              employeeData={{
                serialNo: selectedCard.serialNo,
                employeeCode: selectedCard.employeeCode,
                employeeName: selectedCard.employeeName,
                designation: selectedCard.designation,
                cnic: selectedCard.cnic,
                licenceNo: selectedCard.licenceNo,
                licenceCategory: selectedCard.licenceCategory,
                licenceValidity: selectedCard.licenceValidity,
                dateOfIssue: selectedCard.dateOfIssue,
                validUpto: selectedCard.validUpto,
                photo: selectedCard.photoUrl
              }}
              vehicleData={{
                vehicleNo: selectedCard.vehicleNo,
                vehicleType: selectedCard.vehicleType,
                shiftType: selectedCard.shiftType,
                region: selectedCard.region,
                departureBC: selectedCard.departureBC,
                inspectionId: selectedCard.inspectionId,
                validFrom: selectedCard.validFrom,
                validTo: selectedCard.validTo
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
