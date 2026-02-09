import { useState, useEffect, useRef } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { deleteCardFromFirestore } from "../services/firestoreService";
import CardPreview from "../components/CardPreview";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useNotification } from "../context/useNotification";
import { Users, Calendar, FileText, Search, X, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

const Dashboard = ({ onNavigateToCreate, onEditCard, cachedCards, setCachedCards, onLogout, user }) => {
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
      const cardsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCards(cardsData);
      if (typeof setCachedCards === "function") setCachedCards(cardsData);
    } catch {
      addNotification("Failed to load cards. Check Firestore rules.", "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [searchTerm]);

  const handleView = (card) => setSelectedCard(card);
  const handleClosePreview = () => setSelectedCard(null);
  const handleDeleteCard = (cardId, cardName) => setDeleteConfirm({ show: true, cardId, cardName });

  const confirmDelete = async () => {
    const { cardId, cardName } = deleteConfirm;
    setDeleteConfirm({ show: false, cardId: null, cardName: "" });
    setLoading(true);
    setLoadingMessage(`Deleting ${cardName}'s card...`);
    try {
      await deleteCardFromFirestore(cardId);
      const updatedCards = cards.filter((card) => card.id !== cardId);
      setCards(updatedCards);
      if (typeof setCachedCards === "function") setCachedCards(updatedCards);
      addNotification("Card deleted successfully!", "success", 3000);
    } catch {
      addNotification("Failed to delete card. Please try again.", "error", 4000);
    } finally {
      setLoading(false);
    }
  };
  const cancelDelete = () => setDeleteConfirm({ show: false, cardId: null, cardName: "" });

  const filteredCards = cards.filter((card) => {
    if (!debouncedSearch) return true;
    const search = debouncedSearch.toLowerCase();
    return (
      card.serialNo?.toLowerCase().includes(search) ||
      card.employeeCode?.toLowerCase().includes(search) ||
      card.employeeName?.toLowerCase().includes(search) ||
      card.cnic?.toLowerCase().includes(search) ||
      card.vehicleNo?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCards = filteredCards.slice(startIndex, endIndex);
  const handlePageChange = (page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigateToCreate={onNavigateToCreate} onLogout={onLogout} user={user} showCreate />

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{cards.length}</p>
              <p className="text-sm text-gray-500">Total Cards</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredCards.length}</p>
              <p className="text-sm text-gray-500">Search Results</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
              <p className="text-sm text-gray-500">Total Pages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search by Serial No, Name, CNIC, Vehicle No, Employee Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {cards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-lg font-semibold text-gray-700">No cards created yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Create New Card" to get started</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-lg font-semibold text-gray-700">No results found</p>
            <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Serial Number</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CNIC Number</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentCards.map((card) => (
                    <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        {card.photoUrl ? (
                          <img src={card.photoUrl} alt={card.employeeName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">📷</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{card.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{card.serialNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{card.cnic}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleView(card)} title="View" className="p-2 text-gray-500 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"><Eye size={18} /></button>
                          <button onClick={() => onEditCard && onEditCard(card)} title="Edit" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={18} /></button>
                          <button onClick={() => handleDeleteCard(card.id, card.employeeName)} title="Delete" className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50">
              <p className="text-sm text-gray-500">Showing {startIndex + 1} to {Math.min(endIndex, filteredCards.length)} of {filteredCards.length} entries</p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"><ChevronLeft size={16} /> Prev</button>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return <button key={page} onClick={() => handlePageChange(page)} className={`w-9 h-9 text-sm font-semibold rounded-lg transition-colors ${currentPage === page ? 'bg-primary text-white' : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'}`}>{page}</button>;
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-1 text-gray-400">...</span>;
                  }
                  return null;
                })}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">Next <ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={handleClosePreview}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <CardPreview
              isModal={true}
              onClose={handleClosePreview}
              employeeData={{ serialNo: selectedCard.serialNo, employeeCode: selectedCard.employeeCode, employeeName: selectedCard.employeeName, designation: selectedCard.designation, cnic: selectedCard.cnic, licenceNo: selectedCard.licenceNo, licenceCategory: selectedCard.licenceCategory, licenceValidity: selectedCard.licenceValidity, dateOfIssue: selectedCard.dateOfIssue, validUpto: selectedCard.validUpto, photo: selectedCard.photoUrl }}
              vehicleData={{ vehicleNo: selectedCard.vehicleNo, vehicleType: selectedCard.vehicleType, shiftType: selectedCard.shiftType, region: selectedCard.region, departureBC: selectedCard.departureBC, inspectionId: selectedCard.inspectionId, validFrom: selectedCard.validFrom, validTo: selectedCard.validTo }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={cancelDelete}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="bg-primary p-5 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg flex items-center gap-2"><AlertTriangle size={20} /> Confirm Delete</h3>
              <button onClick={cancelDelete} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-600">Are you sure you want to delete the card for:</p>
              <p className="text-xl font-bold text-primary my-4">{deleteConfirm.cardName}</p>
              <p className="text-sm text-gray-400 italic">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 p-4 bg-gray-50 border-t border-gray-100">
              <button onClick={cancelDelete} className="flex-1 py-3 font-semibold text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-3 font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"><Trash2 size={18} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {loading && <Loader message={loadingMessage} />}
    </div>
  );
};

export default Dashboard;
