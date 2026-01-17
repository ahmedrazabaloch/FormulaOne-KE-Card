import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Upload image to Cloudinary and get URL
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<string>} - Cloudinary image URL
 */
export const uploadImageToCloudinary = async (base64Image) => {
  try {
    const formData = new FormData();
    formData.append("file", base64Image); // base64 string (data:image/jpeg;base64,...)
    formData.append("upload_preset", "office_duty_card"); // Must match your preset name exactly
    formData.append("folder", "office-duty-cards"); // Optional: organize uploads in a folder
    
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dp8lgz4p1/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error details:", errorData);
      throw new Error(`Cloudinary upload failed: ${response.statusText} - ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    return data.secure_url; // Returns HTTPS URL
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

/**
 * Save card data to Firestore with photo from Cloudinary
 * @param {Object} employeeData - Employee form data
 * @param {Object} vehicleData - Vehicle form data
 * @returns {Promise<string>} - Card document ID
 */
export const saveCardToFirestore = async (employeeData, vehicleData) => {
  try {
    let photoUrl = null;

    // Upload photo to Cloudinary if present
    if (employeeData.photo) {
      photoUrl = await uploadImageToCloudinary(employeeData.photo);
    }

    // Prepare card data
    const cardData = {
      // Employee data
      serialNo: employeeData.serialNo,
      employeeCode: employeeData.employeeCode,
      employeeName: employeeData.employeeName,
      designation: employeeData.designation,
      cnic: employeeData.cnic,
      licenceNo: employeeData.licenceNo,
      licenceCategory: employeeData.licenceCategory,
      licenceValidity: employeeData.licenceValidity,
      dateOfIssue: employeeData.dateOfIssue,
      validUpto: employeeData.validUpto,
      photoUrl,

      // Vehicle data
      vehicleNo: vehicleData.vehicleNo,
      vehicleType: vehicleData.vehicleType,
      shiftType: vehicleData.shiftType,
      region: vehicleData.region,
      departureBC: vehicleData.departureBC,
      inspectionId: vehicleData.inspectionId,
      validFrom: vehicleData.validFrom,
      validTo: vehicleData.validTo,

      // Metadata
      createdAt: serverTimestamp(),
    };

    // Save to Firestore
    const cardsCollection = collection(db, "cards");
    const docRef = await addDoc(cardsCollection, cardData);

    return docRef.id;
  } catch (error) {
    console.error("Error saving card to Firestore:", error);
    throw error;
  }
};

/**
 * Update existing card data in Firestore
 * @param {string} cardId - Document ID
 * @param {Object} employeeData - Employee form data
 * @param {Object} vehicleData - Vehicle form data
 * @returns {Promise<void>}
 */
export const updateCardInFirestore = async (cardId, employeeData, vehicleData) => {
  try {
    let photoUrl = employeeData.photoUrl;

    // Upload new photo to Cloudinary if a new one is provided (starts with data:)
    if (employeeData.photo && employeeData.photo.startsWith("data:")) {
      photoUrl = await uploadImageToCloudinary(employeeData.photo);
    }

    // Prepare card data
    const cardData = {
      // Employee data
      serialNo: employeeData.serialNo,
      employeeCode: employeeData.employeeCode,
      employeeName: employeeData.employeeName,
      designation: employeeData.designation,
      cnic: employeeData.cnic,
      licenceNo: employeeData.licenceNo,
      licenceCategory: employeeData.licenceCategory,
      licenceValidity: employeeData.licenceValidity,
      dateOfIssue: employeeData.dateOfIssue,
      validUpto: employeeData.validUpto,
      ...(photoUrl && { photoUrl }),

      // Vehicle data
      vehicleNo: vehicleData.vehicleNo,
      vehicleType: vehicleData.vehicleType,
      shiftType: vehicleData.shiftType,
      region: vehicleData.region,
      departureBC: vehicleData.departureBC,
      inspectionId: vehicleData.inspectionId,
      validFrom: vehicleData.validFrom,
      validTo: vehicleData.validTo,

      // Metadata
      updatedAt: serverTimestamp(),
    };

    // Update in Firestore
    const cardRef = doc(db, "cards", cardId);
    await updateDoc(cardRef, cardData);
  } catch (error) {
    console.error("Error updating card in Firestore:", error);
    throw error;
  }
};

/**
 * Delete a card from Firestore
 * @param {string} cardId - Document ID
 * @returns {Promise<void>}
 */
export const deleteCardFromFirestore = async (cardId) => {
  try {
    const cardRef = doc(db, "cards", cardId);
    await deleteDoc(cardRef);
  } catch (error) {
    console.error("Error deleting card from Firestore:", error);
    throw error;
  }
};
