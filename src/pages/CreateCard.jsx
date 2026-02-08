import { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
import CardPreview from "../components/CardPreview";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useNotification } from "../context/useNotification";
import { saveCardToFirestore, updateCardInFirestore } from "../services/firestoreService";
import { validateFields, checkUniqueness } from "../utils/validators";

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

  // Load from localStorage or editingCard on mount
  useEffect(() => {
    if (editingCard) {
      setEmployeeData({
        serialNo: editingCard.serialNo,
        employeeCode: editingCard.employeeCode,
        employeeName: editingCard.employeeName,
        designation: editingCard.designation,
        cnic: editingCard.cnic,
        licenceNo: editingCard.licenceNo,
        licenceCategory: editingCard.licenceCategory,
        licenceValidity: editingCard.licenceValidity,
        dateOfIssue: editingCard.dateOfIssue,
        validUpto: editingCard.validUpto,
        photoUrl: editingCard.photoUrl,
        photo: editingCard.photoUrl,
      });
      setVehicleData({
        vehicleNo: editingCard.vehicleNo,
        vehicleType: editingCard.vehicleType,
        shiftType: editingCard.shiftType,
        region: editingCard.region,
        departureBC: editingCard.departureBC,
        inspectionId: editingCard.inspectionId,
        validFrom: editingCard.validFrom,
        validTo: editingCard.validTo,
      });
    } else {
      try {
        const savedEmployee = localStorage.getItem("employeeData");
        const savedVehicle = localStorage.getItem("vehicleData");
        if (savedEmployee) setEmployeeData(JSON.parse(savedEmployee));
        if (savedVehicle) setVehicleData(JSON.parse(savedVehicle));
      } catch {
        // Ignore corrupted localStorage
      }
    }
  }, [editingCard]);

  // Persist to localStorage
  useEffect(() => {
    if (Object.keys(employeeData).length > 0) {
      try { localStorage.setItem("employeeData", JSON.stringify(employeeData)); } catch { /* noop */ }
    }
  }, [employeeData]);

  useEffect(() => {
    if (Object.keys(vehicleData).length > 0) {
      try { localStorage.setItem("vehicleData", JSON.stringify(vehicleData)); } catch { /* noop */ }
    }
  }, [vehicleData]);

  const validate = async () => {
    // Local validation
    const { empErr, vehErr } = validateFields(employeeData, vehicleData);

    // Uniqueness check against Firestore
    const uniqueness = await checkUniqueness(employeeData, isEditing, editingCard?.id);
    Object.assign(empErr, uniqueness.empErr);

    const ok = Object.keys(empErr).length === 0 && Object.keys(vehErr).length === 0;
    setEmployeeErrors(empErr);
    setVehicleErrors(vehErr);

    if (!ok) {
      addNotification("Please fix the highlighted errors", "error", 3000);
    }

    return ok;
  };

  const handlePreview = async () => {
    if (!(await validate())) return;
    setIsPreviewLoading(true);
    setLoadingMessage("Generating preview...");
    setTimeout(() => {
      setShowPreview(true);
      setIsPreviewLoading(false);
    }, 300);
  };

  const handleSaveToFirestore = async () => {
    setIsSaving(true);
    setLoadingMessage("Validating data...");

    if (!(await validate())) {
      setIsSaving(false);
      return;
    }

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
        setEmployeeData({});
        setVehicleData({});
        setEmployeeErrors({});
        setVehicleErrors({});
        setShowPreview(false);
        if (onCardCreated) {
          onCardCreated();
        } else if (onNavigateToDashboard) {
          onNavigateToDashboard();
        }
      }, 1500);
    } catch {
      addNotification("Error saving card. Please try again.", "error", 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Combined errors for the unified form
  const allErrors = { ...employeeErrors, ...vehicleErrors };
  const allValues = { ...employeeData, ...vehicleData };

  return (
    <>
      {/* HEADER */}
      <Navbar
        onNavigateToDashboard={onNavigateToDashboard}
        onLogout={onLogout}
        user={user}
        title={isEditing ? "Edit Employee Card" : "Create New Employee Card"}
        subtitle="Fill in all required information"
        showBack
      />

      {/* TWO-COLUMN LAYOUT */}
      <main className="create-card-main-container">
        <div className="create-card-content-wrapper">
          {/* LEFT: PHOTO SECTION */}
          <div className="photo-section-card">
            <EmployeeForm
              onChange={setEmployeeData}
              errors={employeeErrors}
              values={employeeData}
              photoOnly
            />
          </div>

          {/* RIGHT: ALL FIELDS IN ONE CARD */}
          <div className="info-section-card">
            <EmployeeForm
              onChange={setEmployeeData}
              onVehicleChange={setVehicleData}
              errors={allErrors}
              values={allValues}
              vehicleData={vehicleData}
              unified
            />

            {/* Action Buttons */}
            <div className="form-actions-bar">
              <button type="button" className="btn-cancel" onClick={onNavigateToDashboard}>
                Cancel
              </button>
              <button type="button" className="btn-preview" onClick={handlePreview}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Preview PDF
              </button>
              <button
                type="button"
                className="btn-save"
                onClick={handleSaveToFirestore}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save to Database
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* PREVIEW */}
      {showPreview && (
        <CardPreview
          employeeData={employeeData}
          vehicleData={vehicleData}
          orientation="portrait"
          isModal
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Global Loader */}
      {(isSaving || isPreviewLoading) && <Loader message={loadingMessage} />}
    </>
  );
};

export default CreateCard;
