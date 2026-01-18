import { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
import VehicleForm from "../components/VehicleForm";
import CardPreview from "../components/CardPreview";
import Loader from "../components/Loader";
import { useNotification } from "../context/useNotification";
import { saveCardToFirestore, updateCardInFirestore } from "../services/firestoreService";
import logo from "../assets/Icon.png";

// Pakistani CNIC Format: 00000-0000000-0 (5 digits, dash, 7 digits, dash, 1 digit)
const CNIC_REGEX = /^\d{5}-\d{7}-\d{1}$/;

const REQUIRED_EMPLOYEE_FIELDS = [
  "serialNo",
  "employeeCode",
  "employeeName",
  "designation",
  "cnic",
  "licenceNo",
  "licenceCategory",
  "licenceValidity",
  "dateOfIssue",
  "validUpto",
  "photo",
];

const REQUIRED_VEHICLE_FIELDS = [
  "vehicleNo",
  "vehicleType",
  "shiftType",
  "region",
  "departureBC",
  "inspectionId",
  "validFrom",
  "validTo",
];

const CreateCard = ({ onNavigateToDashboard, onCardCreated, editingCard }) => {
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

  // Load from localStorage on mount or from editingCard
  useEffect(() => {
    if (editingCard) {
      // Load from editing card
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
        photo: editingCard.photoUrl, // Set for display
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
      // Load from localStorage
      try {
        const savedEmployee = localStorage.getItem("employeeData");
        const savedVehicle = localStorage.getItem("vehicleData");
      if (savedEmployee) setEmployeeData(JSON.parse(savedEmployee));
      if (savedVehicle) setVehicleData(JSON.parse(savedVehicle));
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, [editingCard]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      if (Object.keys(employeeData).length > 0) {
        localStorage.setItem("employeeData", JSON.stringify(employeeData));
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [employeeData]);

  useEffect(() => {
    try {
      if (Object.keys(vehicleData).length > 0) {
        localStorage.setItem("vehicleData", JSON.stringify(vehicleData));
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [vehicleData]);

  const validate = async () => {
    const empErr = {};
    const vehErr = {};
    const errorMessages = [];
    
    // Field name mapping for user-friendly error messages
    const fieldNames = {
      photo: "Employee Photo",
      serialNo: "Serial No",
      employeeCode: "Employee Code",
      employeeName: "Employee Name",
      designation: "Designation",
      cnic: "CNIC No",
      licenceNo: "Licence No",
      licenceCategory: "Licence Category",
      licenceValidity: "Licence Validity",
      dateOfIssue: "Date of Issue",
      validUpto: "Valid Upto",
      vehicleNo: "Vehicle No",
      vehicleType: "Vehicle Type",
      shiftType: "Shift Type",
      region: "Region",
      departureBC: "Departure / BC",
      inspectionId: "Inspection ID",
      validFrom: "Valid From",
      validTo: "Valid To"
    };
    
    // Check required employee fields
    for (let field of REQUIRED_EMPLOYEE_FIELDS) {
      if (!employeeData[field]) {
        empErr[field] = true;
        errorMessages.push(`${fieldNames[field]} is required`);
      }
    }
    
    // Check required vehicle fields
    for (let field of REQUIRED_VEHICLE_FIELDS) {
      if (!vehicleData[field]) {
        vehErr[field] = true;
        errorMessages.push(`${fieldNames[field]} is required`);
      }
    }

    // Validate CNIC format (Pakistani: 00000-0000000-0)
    if (employeeData.cnic && !CNIC_REGEX.test(employeeData.cnic)) {
      empErr.cnic = true;
      errorMessages.push("CNIC format invalid. Use: 00000-0000000-0");
    }

    // Check uniqueness in Firestore (only if fields are filled and not editing the same card)
    if (employeeData.serialNo || employeeData.employeeCode || employeeData.cnic) {
      try {
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const { db } = await import("../config/firebase");
        
        const cardsRef = collection(db, "cards");
        
        // Check Serial No uniqueness
        if (employeeData.serialNo) {
          const qSerial = query(cardsRef, where("serialNo", "==", employeeData.serialNo));
          const snapshotSerial = await getDocs(qSerial);
          if (!snapshotSerial.empty) {
            // If editing, only error if the Serial No belongs to a different card
            if (!isEditing || snapshotSerial.docs[0].id !== editingCard.id) {
              empErr.serialNo = true;
              errorMessages.push("Serial No already exists!");
            }
          }
        }
        
        // Check Employee Code uniqueness
        if (employeeData.employeeCode) {
          const qCode = query(cardsRef, where("employeeCode", "==", employeeData.employeeCode));
          const snapshotCode = await getDocs(qCode);
          if (!snapshotCode.empty) {
            // If editing, only error if the Employee Code belongs to a different card
            if (!isEditing || snapshotCode.docs[0].id !== editingCard.id) {
              empErr.employeeCode = true;
              errorMessages.push("Employee Code already exists!");
            }
          }
        }
        
        // Check CNIC uniqueness (only if format is valid)
        if (employeeData.cnic && CNIC_REGEX.test(employeeData.cnic)) {
          const qCNIC = query(cardsRef, where("cnic", "==", employeeData.cnic));
          const snapshotCNIC = await getDocs(qCNIC);
          if (!snapshotCNIC.empty) {
            // If editing, only error if the CNIC belongs to a different card
            if (!isEditing || snapshotCNIC.docs[0].id !== editingCard.id) {
              empErr.cnic = true;
              errorMessages.push("CNIC already registered!");
            }
          }
        }
      } catch (error) {
        console.error("Error checking uniqueness:", error);
        errorMessages.push("Error checking database. Please try again.");
      }
    }

    const ok = Object.keys(empErr).length === 0 && Object.keys(vehErr).length === 0;
    setEmployeeErrors(empErr);
    setVehicleErrors(vehErr);
    
    // Show first 3 error messages as notifications
    if (!ok && errorMessages.length > 0) {
      const displayMessages = errorMessages.slice(0, 3);
      displayMessages.forEach(msg => {
        addNotification(msg, "error", 4000);
      });
    }
    
    return ok;
  };

  const handlePreview = async () => {
    if (!await validate()) {
      // Notifications already shown in validate()
      return;
    }
    setIsPreviewLoading(true);
    setLoadingMessage("Generating preview...");
    // Simulate small delay for better UX
    setTimeout(() => {
      setShowPreview(true);
      setIsPreviewLoading(false);
    }, 300);
  };

  const handleSaveToFirestore = async () => {
    // Show loader immediately
    setIsSaving(true);
    setLoadingMessage("Validating data...");
    
    if (!await validate()) {
      // Notifications already shown in validate()
      setIsSaving(false);
      return;
    }

    try {
      if (isEditing) {
        // Update existing card
        setLoadingMessage("Updating card...");
        await updateCardInFirestore(editingCard.id, employeeData, vehicleData);
        addNotification("Card updated successfully!", "success", 3000);
      } else {
        // Create new card
        setLoadingMessage("Creating new card...");
        const cardId = await saveCardToFirestore(employeeData, vehicleData);
        addNotification(`Card saved successfully! ID: ${cardId.slice(0, 8)}...`, "success", 3000);
        // Clear localStorage after successful save
        localStorage.removeItem("employeeData");
        localStorage.removeItem("vehicleData");
      }
      // Reset form and navigate
      setTimeout(() => {
        setEmployeeData({});
        setVehicleData({});
        setEmployeeErrors({});
        setVehicleErrors({});
        setShowPreview(false);
        // Navigate back and invalidate cache
        if (onCardCreated) {
          onCardCreated();
        } else if (onNavigateToDashboard) {
          onNavigateToDashboard();
        }
      }, 1500);
    } catch (error) {
      addNotification("Error saving card. Please try again.", "error", 4000);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="top-bar">
        <div 
          className="header-title" 
          onClick={onNavigateToDashboard} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
          title="Back to Dashboard"
        >
          <img src={logo} alt="F1 Logo" style={{ height: '36px' }} />
          <h2>{isEditing ? 'Edit Office Duty Card' : 'Office Duty Card Generator'}</h2>
        </div>
        {onNavigateToDashboard && (
          <button 
            className="back-btn" 
            onClick={onNavigateToDashboard}
            title="Back to Dashboard"
          >
            ← Dashboard
          </button>
        )}
      </header>

      {/* FORM */}
      <main className="layout-center">
        <div className="form-wrapper">
          <EmployeeForm onChange={setEmployeeData} errors={employeeErrors} values={employeeData} />
          <VehicleForm onChange={setVehicleData} errors={vehicleErrors} values={vehicleData} />

          {/* IMPORTANT: type="button" */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" className="primary-btn" onClick={handlePreview}>
              Preview Card
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={handleSaveToFirestore}
              disabled={isSaving}
              style={{ background: isSaving ? "#999" : "#2e7d32" }}
            >
              {isSaving ? "Saving..." : isEditing ? "Update Card" : "Save to Database"}
            </button>
          </div>
        </div>
      </main>

      {/* PREVIEW */}
      {showPreview && (
        <CardPreview
          employeeData={employeeData}
          vehicleData={vehicleData}
          orientation="portrait"
          isModal={true}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Global Loader */}
      {(isSaving || isPreviewLoading) && <Loader message={loadingMessage} />}
    </>
  );
};

export default CreateCard;
