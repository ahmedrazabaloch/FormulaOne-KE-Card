import { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
import CardPreview from "../components/CardPreview";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useNotification } from "../context/useNotification";
import { saveCardToFirestore, updateCardInFirestore } from "../services/firestoreService";
import { validateFields, checkUniqueness } from "../utils/validators";
import { Eye, Save, X } from "lucide-react";

const CreateCard = ({ onNavigateToDashboard, onCardCreated, editingCard, onLogout, user }) => {
  const { addNotification } = useNotification();
  const [employeeData, setEmployeeData] = useState({});
  const [vehicleData, setVehicleData] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [employeeErrors, setEmployeeErrors] = useState({});
  const [vehicleErrors, setVehicleErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!editingCard;

  useEffect(() => {
    if (editingCard) {
      setEmployeeData({
        serialNo: editingCard.serialNo, employeeCode: editingCard.employeeCode, employeeName: editingCard.employeeName,
        designation: editingCard.designation, cnic: editingCard.cnic, licenceNo: editingCard.licenceNo,
        licenceCategory: editingCard.licenceCategory, licenceValidity: editingCard.licenceValidity,
        dateOfIssue: editingCard.dateOfIssue, validUpto: editingCard.validUpto,
        photoUrl: editingCard.photoUrl, photo: editingCard.photoUrl,
      });
      setVehicleData({
        vehicleNo: editingCard.vehicleNo, vehicleType: editingCard.vehicleType, shiftType: editingCard.shiftType,
        region: editingCard.region, departureBC: editingCard.departureBC, inspectionId: editingCard.inspectionId,
        validFrom: editingCard.validFrom, validTo: editingCard.validTo,
      });
    } else {
      try {
        const savedEmployee = localStorage.getItem("employeeData");
        const savedVehicle = localStorage.getItem("vehicleData");
        if (savedEmployee) setEmployeeData(JSON.parse(savedEmployee));
        if (savedVehicle) setVehicleData(JSON.parse(savedVehicle));
      } catch { /* Ignore */ }
    }
  }, [editingCard]);

  useEffect(() => { if (Object.keys(employeeData).length > 0) try { localStorage.setItem("employeeData", JSON.stringify(employeeData)); } catch { /* noop */ } }, [employeeData]);
  useEffect(() => { if (Object.keys(vehicleData).length > 0) try { localStorage.setItem("vehicleData", JSON.stringify(vehicleData)); } catch { /* noop */ } }, [vehicleData]);

  const validate = async () => {
    const { empErr, vehErr } = validateFields(employeeData, vehicleData);
    const uniqueness = await checkUniqueness(employeeData, isEditing, editingCard?.id);
    Object.assign(empErr, uniqueness.empErr);
    const ok = Object.keys(empErr).length === 0 && Object.keys(vehErr).length === 0;
    setEmployeeErrors(empErr);
    setVehicleErrors(vehErr);
    if (!ok) addNotification("Please fix the highlighted errors", "error", 3000);
    return ok;
  };

  const handlePreview = async () => {
    if (!(await validate())) return;
    setIsPreviewLoading(true);
    setLoadingMessage("Generating preview...");
    setTimeout(() => { setShowPreview(true); setIsPreviewLoading(false); }, 300);
  };

  const handleSaveToFirestore = async () => {
    setIsSaving(true);
    setLoadingMessage("Validating data...");
    if (!(await validate())) { setIsSaving(false); return; }
    try {
      if (isEditing) {
        setLoadingMessage("Updating card...");
        await updateCardInFirestore(editingCard.id, employeeData, vehicleData);
        addNotification("Card updated successfully!", "success", 3000);
      } else {
        setLoadingMessage("Creating new card...");
        const cardId = await saveCardToFirestore(employeeData, vehicleData);
        addNotification(`Card saved successfully! ID: ${cardId.slice(0, 8)}...`, "success", 3000);
        localStorage.removeItem("employeeData");
        localStorage.removeItem("vehicleData");
      }
      setTimeout(() => {
        setEmployeeData({}); setVehicleData({}); setEmployeeErrors({}); setVehicleErrors({}); setShowPreview(false);
        if (onCardCreated) onCardCreated(); else if (onNavigateToDashboard) onNavigateToDashboard();
      }, 1500);
    } catch { addNotification("Error saving card. Please try again.", "error", 4000); } finally { setIsSaving(false); }
  };

  const allErrors = { ...employeeErrors, ...vehicleErrors };
  const allValues = { ...employeeData, ...vehicleData };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigateToDashboard={onNavigateToDashboard} onLogout={onLogout} user={user} title={isEditing ? "Edit Employee Card" : "Create New Employee Card"} subtitle="Fill in all required information" showBack />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Photo Section */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
              <EmployeeForm onChange={setEmployeeData} errors={employeeErrors} values={employeeData} photoOnly />
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <EmployeeForm onChange={setEmployeeData} onVehicleChange={setVehicleData} errors={allErrors} values={allValues} vehicleData={vehicleData} unified />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <button type="button" onClick={onNavigateToDashboard} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                  <X size={18} /> Cancel
                </button>
                <button type="button" onClick={handlePreview} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-primary bg-primary-light hover:bg-red-100 rounded-xl font-medium transition-colors">
                  <Eye size={18} /> Preview PDF
                </button>
                <button type="button" onClick={handleSaveToFirestore} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-white bg-primary hover:bg-primary-dark rounded-xl font-semibold shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSaving ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</> : <><Save size={18} /> Save to Database</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showPreview && <CardPreview employeeData={employeeData} vehicleData={vehicleData} orientation="portrait" isModal onClose={() => setShowPreview(false)} />}
      {(isSaving || isPreviewLoading) && <Loader message={loadingMessage} />}
    </div>
  );
};

export default CreateCard;
