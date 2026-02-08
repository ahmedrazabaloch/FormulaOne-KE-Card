import { CNIC_REGEX } from "./cnicFormatter";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const REQUIRED_EMPLOYEE_FIELDS = [
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

export const REQUIRED_VEHICLE_FIELDS = [
  "vehicleNo",
  "vehicleType",
  "shiftType",
  "region",
  "departureBC",
  "inspectionId",
  "validFrom",
  "validTo",
];

export const FIELD_LABELS = {
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
  validTo: "Valid To",
};

/**
 * Validate employee and vehicle data, returning error maps and messages
 * @param {Object} employeeData
 * @param {Object} vehicleData
 * @returns {{ empErr: Object, vehErr: Object, errorMessages: string[] }}
 */
export const validateFields = (employeeData, vehicleData) => {
  const empErr = {};
  const vehErr = {};
  const errorMessages = [];

  for (const field of REQUIRED_EMPLOYEE_FIELDS) {
    if (!employeeData[field]) {
      empErr[field] = `${FIELD_LABELS[field]} is required`;
      errorMessages.push(empErr[field]);
    }
  }

  for (const field of REQUIRED_VEHICLE_FIELDS) {
    if (!vehicleData[field]) {
      vehErr[field] = `${FIELD_LABELS[field]} is required`;
      errorMessages.push(vehErr[field]);
    }
  }

  if (employeeData.cnic && !CNIC_REGEX.test(employeeData.cnic)) {
    empErr.cnic = "CNIC format invalid. Use: 00000-0000000-0";
    errorMessages.push(empErr.cnic);
  }

  return { empErr, vehErr, errorMessages };
};

/**
 * Check uniqueness of serialNo, employeeCode, cnic in Firestore
 * @param {Object} employeeData
 * @param {boolean} isEditing
 * @param {string|null} editingCardId
 * @returns {Promise<{ empErr: Object, errorMessages: string[] }>}
 */
export const checkUniqueness = async (employeeData, isEditing, editingCardId) => {
  const empErr = {};
  const errorMessages = [];

  if (!employeeData.serialNo && !employeeData.employeeCode && !employeeData.cnic) {
    return { empErr, errorMessages };
  }

  try {
    const cardsRef = collection(db, "cards");

    if (employeeData.serialNo) {
      const q = query(cardsRef, where("serialNo", "==", employeeData.serialNo));
      const snapshot = await getDocs(q);
      if (!snapshot.empty && (!isEditing || snapshot.docs[0].id !== editingCardId)) {
        empErr.serialNo = "Serial No already exists!";
        errorMessages.push(empErr.serialNo);
      }
    }

    if (employeeData.employeeCode) {
      const q = query(cardsRef, where("employeeCode", "==", employeeData.employeeCode));
      const snapshot = await getDocs(q);
      if (!snapshot.empty && (!isEditing || snapshot.docs[0].id !== editingCardId)) {
        empErr.employeeCode = "Employee Code already exists!";
        errorMessages.push(empErr.employeeCode);
      }
    }

    if (employeeData.cnic && CNIC_REGEX.test(employeeData.cnic)) {
      const q = query(cardsRef, where("cnic", "==", employeeData.cnic));
      const snapshot = await getDocs(q);
      if (!snapshot.empty && (!isEditing || snapshot.docs[0].id !== editingCardId)) {
        empErr.cnic = "CNIC already registered!";
        errorMessages.push(empErr.cnic);
      }
    }
  } catch {
    errorMessages.push("Error checking database. Please try again.");
  }

  return { empErr, errorMessages };
};
