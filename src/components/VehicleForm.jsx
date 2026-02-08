import { formatMonthYear, addOneYear, displayToInputValue } from "../utils/dateFormatters";

const FieldError = ({ errors, field }) => {
  const msg = errors[field];
  if (!msg) return null;
  return <span className="field-error-msg">{msg}</span>;
};

const VehicleForm = ({ onChange, errors = {}, values = {} }) => {
  const handleChange = (e) => {
    onChange((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="vehicle-info-section">
      <h3 className="section-title">Vehicle Information</h3>

      <div className="form-grid-single">
        <div className="form-row">
          <div className="form-field">
            <label>Vehicle No <span className="required">*</span></label>
            <input
              type="text"
              name="vehicleNo"
              value={values.vehicleNo || ""}
              onChange={handleChange}
              className={errors.vehicleNo ? "input-error" : ""}
            />
            <FieldError errors={errors} field="vehicleNo" />
          </div>
          <div className="form-field">
            <label>Vehicle Type <span className="required">*</span></label>
            <input
              type="text"
              name="vehicleType"
              value={values.vehicleType || ""}
              onChange={handleChange}
              className={errors.vehicleType ? "input-error" : ""}
            />
            <FieldError errors={errors} field="vehicleType" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Shift Type <span className="required">*</span></label>
            <input
              type="text"
              name="shiftType"
              value={values.shiftType || ""}
              onChange={handleChange}
              className={errors.shiftType ? "input-error" : ""}
            />
            <FieldError errors={errors} field="shiftType" />
          </div>
          <div className="form-field">
            <label>Region <span className="required">*</span></label>
            <input
              type="text"
              name="region"
              value={values.region || ""}
              onChange={handleChange}
              className={errors.region ? "input-error" : ""}
            />
            <FieldError errors={errors} field="region" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Departure / BC <span className="required">*</span></label>
            <input
              type="text"
              name="departureBC"
              value={values.departureBC || ""}
              onChange={handleChange}
              className={errors.departureBC ? "input-error" : ""}
            />
            <FieldError errors={errors} field="departureBC" />
          </div>
          <div className="form-field">
            <label>Inspection ID <span className="required">*</span></label>
            <input
              type="text"
              name="inspectionId"
              value={values.inspectionId || ""}
              onChange={handleChange}
              className={errors.inspectionId ? "input-error" : ""}
            />
            <FieldError errors={errors} field="inspectionId" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Valid From <span className="required">*</span></label>
            <input
              type="month"
              name="validFrom"
              value={displayToInputValue(values.validFrom)}
              onChange={(e) => {
                const raw = e.target.value;
                const formatted = formatMonthYear(raw);
                const autoTo = addOneYear(raw);
                onChange((prev) => ({ ...prev, validFrom: formatted, validTo: autoTo }));
              }}
              className={errors.validFrom ? "input-error" : ""}
            />
            <FieldError errors={errors} field="validFrom" />
          </div>
          <div className="form-field">
            <label>Valid To <span className="required">*</span></label>
            <input
              type="month"
              name="validTo"
              value={displayToInputValue(values.validTo)}
              onChange={(e) => {
                const formatted = formatMonthYear(e.target.value);
                onChange((prev) => ({ ...prev, validTo: formatted }));
              }}
              className={errors.validTo ? "input-error" : ""}
            />
            <FieldError errors={errors} field="validTo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
