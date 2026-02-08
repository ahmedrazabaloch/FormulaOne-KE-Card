import { useState } from "react";
import CameraCapture from "./CameraCapture";
import { formatMonthYear, addOneYear, displayToInputValue } from "../utils/dateFormatters";
import { formatCNIC } from "../utils/cnicFormatter";

const FieldError = ({ errors, field }) => {
  const msg = errors[field];
  if (!msg) return null;
  return <span className="field-error-msg">{msg}</span>;
};

const EmployeeForm = ({
  onChange,
  errors = {},
  values = {},
  photoOnly = false,
  unified = false,
  onVehicleChange,
  vehicleData = {},
}) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleCNICChange = (e) => {
    const formatted = formatCNIC(e.target.value);
    onChange((prev) => ({ ...prev, cnic: formatted }));
  };

  /* â”€â”€ PHOTO-ONLY MODE â”€â”€ */
  if (photoOnly) {
    return (
      <>
        <div className="photo-upload-section">
          <h3>Employee Photo</h3>

          <div className="photo-placeholder">
            {values.photo ? (
              <img src={values.photo} alt="Employee" className="photo-preview-large" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          {errors.photo && <span className="field-error-msg photo-error">{errors.photo}</span>}

          <div className="photo-buttons">
            <button
              type="button"
              onClick={() => document.getElementById("photo-file-input").click()}
              className="upload-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload Image
            </button>

            <button type="button" onClick={() => setShowCamera(true)} className="camera-btn-figma">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Open Camera
            </button>

            <input
              id="photo-file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => onChange((prev) => ({ ...prev, photo: reader.result }));
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>

        {showCamera && (
          <CameraCapture
            onCapture={(imageData) => onChange((prev) => ({ ...prev, photo: imageData }))}
            onClose={() => setShowCamera(false)}
          />
        )}
      </>
    );
  }

  /* â”€â”€ UNIFIED MODE (all fields in single grid) â”€â”€ */
  if (unified) {
    return (
      <div className="unified-form-section">
        <h3 className="form-section-title">Employee Information</h3>

        <div className="unified-form-grid">
          {/* Row 1: Serial No | Employee Code */}
          <div className="form-field-inline">
            <label>Serial No <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="serialNo"
              value={values.serialNo || ""}
              onChange={(e) => onChange((prev) => ({ ...prev, serialNo: e.target.value }))}
              className={errors.serialNo ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="serialNo" />
          </div>
          <div className="form-field-inline">
            <label>Employee Code <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="employeeCode"
              value={values.employeeCode || ""}
              onChange={(e) => onChange((prev) => ({ ...prev, employeeCode: e.target.value }))}
              className={errors.employeeCode ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="employeeCode" />
          </div>

          {/* Row 2: Employee Name (full width) */}
          <div className="form-field-fullwidth">
            <label>Employee Name <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="employeeName"
              value={values.employeeName || ""}
              onChange={(e) => onChange((prev) => ({ ...prev, employeeName: e.target.value }))}
              className={errors.employeeName ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="employeeName" />
          </div>

          {/* Row 3: Designation | CNIC No */}
          <div className="form-field-inline">
            <label>Designation <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="designation"
              value={values.designation || ""}
              onChange={(e) => onChange((prev) => ({ ...prev, designation: e.target.value }))}
              className={errors.designation ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="designation" />
          </div>
          <div className="form-field-inline">
            <label>CNIC No <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="cnic"
              value={values.cnic || ""}
              onChange={handleCNICChange}
              className={errors.cnic ? "input-error-state" : ""}
              placeholder="12345-0789012-3"
              maxLength={15}
            />
            <FieldError errors={errors} field="cnic" />
          </div>

          {/* Row 4: Licence No | Licence Category */}
          <div className="form-field-inline">
            <label>Licence No <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="licenceNo"
              value={values.licenceNo || ""}
              onChange={(e) => onChange((prev) => ({ ...prev, licenceNo: e.target.value }))}
              className={errors.licenceNo ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="licenceNo" />
          </div>
          <div className="form-field-inline">
            <label>Licence Category <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="licenceCategory"
              value={values.licenceCategory || ""}
              onChange={(e) => onChange((prev) => ({ ...prev, licenceCategory: e.target.value }))}
              className={errors.licenceCategory ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="licenceCategory" />
          </div>

          {/* Row 5: Licence Validity | Date of Issue */}
          <div className="form-field-inline">
            <label>Licence Validity <span className="required-asterisk">*</span></label>
            <input
              type="month"
              name="licenceValidity"
              value={displayToInputValue(values.licenceValidity)}
              onChange={(e) => {
                const formatted = formatMonthYear(e.target.value);
                onChange((prev) => ({ ...prev, licenceValidity: formatted }));
              }}
              className={errors.licenceValidity ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="licenceValidity" />
          </div>
          <div className="form-field-inline">
            <label>Date of Issue <span className="required-asterisk">*</span></label>
            <input
              type="month"
              name="dateOfIssue"
              value={displayToInputValue(values.dateOfIssue)}
              onChange={(e) => {
                const raw = e.target.value;
                const formatted = formatMonthYear(raw);
                const autoValid = addOneYear(raw);
                onChange((prev) => ({ ...prev, dateOfIssue: formatted, validUpto: autoValid }));
              }}
              className={errors.dateOfIssue ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="dateOfIssue" />
          </div>

          {/* Row 6: Valid Upto | Vehicle No */}
          <div className="form-field-inline">
            <label>Valid Upto <span className="required-asterisk">*</span></label>
            <input
              type="month"
              name="validUpto"
              value={displayToInputValue(values.validUpto)}
              onChange={(e) => {
                const formatted = formatMonthYear(e.target.value);
                onChange((prev) => ({ ...prev, validUpto: formatted }));
              }}
              className={errors.validUpto ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="validUpto" />
          </div>
          <div className="form-field-inline">
            <label>Vehicle No <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="vehicleNo"
              value={vehicleData.vehicleNo || ""}
              onChange={(e) => onVehicleChange((prev) => ({ ...prev, vehicleNo: e.target.value }))}
              className={errors.vehicleNo ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="vehicleNo" />
          </div>

          {/* Row 7: Vehicle Type | Shift Type */}
          <div className="form-field-inline">
            <label>Vehicle Type <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="vehicleType"
              value={vehicleData.vehicleType || ""}
              onChange={(e) => onVehicleChange((prev) => ({ ...prev, vehicleType: e.target.value }))}
              className={errors.vehicleType ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="vehicleType" />
          </div>
          <div className="form-field-inline">
            <label>Shift Type <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="shiftType"
              value={vehicleData.shiftType || ""}
              onChange={(e) => onVehicleChange((prev) => ({ ...prev, shiftType: e.target.value }))}
              className={errors.shiftType ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="shiftType" />
          </div>

          {/* Row 8: Region | Departure / BC */}
          <div className="form-field-inline">
            <label>Region <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="region"
              value={vehicleData.region || ""}
              onChange={(e) => onVehicleChange((prev) => ({ ...prev, region: e.target.value }))}
              className={errors.region ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="region" />
          </div>
          <div className="form-field-inline">
            <label>Departure / BC <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="departureBC"
              value={vehicleData.departureBC || ""}
              onChange={(e) => onVehicleChange((prev) => ({ ...prev, departureBC: e.target.value }))}
              className={errors.departureBC ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="departureBC" />
          </div>

          {/* Row 9: Inspection ID | Valid From */}
          <div className="form-field-inline">
            <label>Inspection ID <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="inspectionId"
              value={vehicleData.inspectionId || ""}
              onChange={(e) => onVehicleChange((prev) => ({ ...prev, inspectionId: e.target.value }))}
              className={errors.inspectionId ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="inspectionId" />
          </div>
          <div className="form-field-inline">
            <label>Valid From <span className="required-asterisk">*</span></label>
            <input
              type="month"
              name="validFrom"
              value={displayToInputValue(vehicleData.validFrom)}
              onChange={(e) => {
                const raw = e.target.value;
                const formatted = formatMonthYear(raw);
                const autoTo = addOneYear(raw);
                onVehicleChange((prev) => ({ ...prev, validFrom: formatted, validTo: autoTo }));
              }}
              className={errors.validFrom ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="validFrom" />
          </div>

          {/* Row 10: Valid To (left-aligned) */}
          <div className="form-field-inline">
            <label>Valid To <span className="required-asterisk">*</span></label>
            <input
              type="month"
              name="validTo"
              value={displayToInputValue(vehicleData.validTo)}
              onChange={(e) => {
                const formatted = formatMonthYear(e.target.value);
                onVehicleChange((prev) => ({ ...prev, validTo: formatted }));
              }}
              className={errors.validTo ? "input-error-state" : ""}
            />
            <FieldError errors={errors} field="validTo" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default EmployeeForm;
