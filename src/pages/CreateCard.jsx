import { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
import VehicleForm from "../components/VehicleForm";
import CardPreview from "../components/CardPreview";
import Toast from "../components/Toast";
import { saveCardToFirestore } from "../services/firestoreService";
import logo from "../assets/logo.png";

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

const CreateCard = ({ onNavigateToDashboard }) => {
  const [employeeData, setEmployeeData] = useState({});
  const [vehicleData, setVehicleData] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [employeeErrors, setEmployeeErrors] = useState({});
  const [vehicleErrors, setVehicleErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedEmployee = localStorage.getItem("employeeData");
      const savedVehicle = localStorage.getItem("vehicleData");
      if (savedEmployee) setEmployeeData(JSON.parse(savedEmployee));
      if (savedVehicle) setVehicleData(JSON.parse(savedVehicle));
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []);

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

    // Check uniqueness in Firestore (only if fields are filled)
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
            empErr.serialNo = true;
            errorMessages.push("Serial No already exists!");
          }
        }
        
        // Check Employee Code uniqueness
        if (employeeData.employeeCode) {
          const qCode = query(cardsRef, where("employeeCode", "==", employeeData.employeeCode));
          const snapshotCode = await getDocs(qCode);
          if (!snapshotCode.empty) {
            empErr.employeeCode = true;
            errorMessages.push("Employee Code already exists!");
          }
        }
        
        // Check CNIC uniqueness (only if format is valid)
        if (employeeData.cnic && CNIC_REGEX.test(employeeData.cnic)) {
          const qCNIC = query(cardsRef, where("cnic", "==", employeeData.cnic));
          const snapshotCNIC = await getDocs(qCNIC);
          if (!snapshotCNIC.empty) {
            empErr.cnic = true;
            errorMessages.push("CNIC already registered!");
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
    
    // Show first 3 error messages
    if (!ok && errorMessages.length > 0) {
      const displayMessages = errorMessages.slice(0, 3);
      setToastMessage(displayMessages.join(" • "));
    }
    
    return ok;
  };

  const handlePreview = async () => {
    if (!await validate()) {
      // Error message already set in validate()
      return;
    }
    setToastMessage("");
    setShowPreview(true);
  };

  const handleSaveToFirestore = async () => {
    if (!await validate()) {
      // Error message already set in validate()
      return;
    }

    setIsSaving(true);
    try {
      const cardId = await saveCardToFirestore(employeeData, vehicleData);
      setToastMessage(`Card saved successfully! ID: ${cardId.slice(0, 8)}...`);
      // Clear localStorage after successful save
      localStorage.removeItem("employeeData");
      localStorage.removeItem("vehicleData");
      // Reset form
      setTimeout(() => {
        setEmployeeData({});
        setVehicleData({});
        setEmployeeErrors({});
        setVehicleErrors({});
        setShowPreview(false);
      }, 1500);
    } catch (error) {
      setToastMessage("Error saving card. Please try again.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="top-bar">
        <img src={logo} alt="Formula One Logistics" />
        <h2>Office Duty Card Generator</h2>
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
          <VehicleForm onChange={setVehicleData} errors={vehicleErrors} />

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
              {isSaving ? "Saving..." : "Save to Database"}
            </button>
          </div>
        </div>
      </main>

      {/* TOAST */}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      {/* PREVIEW */}
      {showPreview && (
        <CardPreview
          employeeData={employeeData}
          vehicleData={vehicleData}
          orientation="portrait"
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default CreateCard;
