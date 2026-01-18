import { useState, useEffect, useRef } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { deleteCardFromFirestore } from "../services/firestoreService";
import CardPreview from "../components/CardPreview";
import Loader from "../components/Loader";
import { useNotification } from "../context/useNotification";
import "../styles/dashboard.css";
import logo from "../assets/Icon.png";

const Dashboard = ({ onNavigateToCreate, onEditCard, cachedCards, setCachedCards }) => {
  const { addNotification } = useNotification();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchTimeout = useRef(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, cardId: null, cardName: "" });

  useEffect(() => {
    const init = async () => {
      if (cachedCards && Array.isArray(cachedCards) && cachedCards.length > 0) {
        setCards(cachedCards);
        return;
      }
      await fetchCards();
    };
    init();
    // Watch cachedCards updates
  }, []);

  useEffect(() => {
    if (cachedCards && Array.isArray(cachedCards)) {
      setCards(cachedCards);
    }
  }, [cachedCards]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Loading cards...");
      const cardsRef = collection(db, "cards");
      const q = query(cardsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const cardsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCards(cardsData);
      if (typeof setCachedCards === "function") {
        setCachedCards(cardsData);
      }
    } catch (err) {
      console.error("Error fetching cards:", err);
      addNotification("Failed to load cards. Check Firestore rules.", "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  const handleView = (card) => {
    setSelectedCard(card);
  };

  const handleClosePreview = () => {
    setSelectedCard(null);
  };

  const handleDeleteCard = (cardId, cardName) => {
    setDeleteConfirm({ show: true, cardId, cardName });
  };

  const confirmDelete = async () => {
    const { cardId, cardName } = deleteConfirm;
    setDeleteConfirm({ show: false, cardId: null, cardName: "" });
    setLoading(true);
    setLoadingMessage(`Deleting ${cardName}'s card...`);

    try {
      await deleteCardFromFirestore(cardId);
      const updatedCards = cards.filter((card) => card.id !== cardId);
      setCards(updatedCards);
      if (typeof setCachedCards === "function") {
        setCachedCards(updatedCards);
      }
      addNotification("Card deleted successfully!", "success", 3000);
    } catch (err) {
      console.error("Error deleting card:", err);
      addNotification("Failed to delete card. Please try again.", "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, cardId: null, cardName: "" });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-GB");
    } catch {
      return "Invalid Date";
    }
  };

  // Filter cards based on debounced search term
  const filteredCards = cards.filter((card) => {
    if (!debouncedSearch) return true;

    const search = debouncedSearch.toLowerCase();
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

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCards = filteredCards.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-title" onClick={() => window.location.reload()} style={{ cursor: "pointer" }}>
          <img src={logo} alt="F1 Logo" className="dashboard-logo" />
          <h1>Office Duty Cards</h1>
        </div>
        <button className="btn-primary" onClick={onNavigateToCreate}>
          ➕ Create New Card
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by Serial No, Name, CNIC, Vehicle No, Employee Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>✕</button>
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
              {currentCards.map((card) => (
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
                    <button className="btn-view" onClick={() => handleView(card)} title="View & Download PDF">
                      👁️ View
                    </button>
                    <button className="btn-edit" onClick={() => onEditCard && onEditCard(card)} title="Edit Card">
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCard(card.id, card.employeeName)}
                      title="Delete Card"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredCards.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCards.length)} of {filteredCards.length} entries
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="pagination-ellipsis">...</span>;
              }
              return null;
            })}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {selectedCard && (
        <div className="modal-overlay" onClick={handleClosePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CardPreview
              isModal={true}
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
                photo: selectedCard.photoUrl,
              }}
              vehicleData={{
                vehicleNo: selectedCard.vehicleNo,
                vehicleType: selectedCard.vehicleType,
                shiftType: selectedCard.shiftType,
                region: selectedCard.region,
                departureBC: selectedCard.departureBC,
                inspectionId: selectedCard.inspectionId,
                validFrom: selectedCard.validFrom,
                validTo: selectedCard.validTo,
              }}
            />
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>⚠️ Confirm Delete</h3>
              <button className="modal-close" onClick={cancelDelete}>✕</button>
            </div>
            <div className="delete-modal-body">
              <p>Are you sure you want to delete the card for:</p>
              <strong>{deleteConfirm.cardName}</strong>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading && <Loader message={loadingMessage} />}
    </div>
  );
};

export default Dashboard;
