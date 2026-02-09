import logo from "../assets/logo.png";

const CardBack = ({ data, orientation = "portrait" }) => {
  return (
    <div className={`card-modern ${orientation === 'portrait' ? 'card-portrait' : ''}`}>
      {/* HEADER */}
      <div className="card-back-header">
        <h3>Vehicle Deputed on KE Duty</h3>
      </div>

      {/* FORM FIELDS - Table Layout */}
      <div className="form-table-modern">
        {[
          ["Licence No", data.licenceNo],
          ["Licence Category", data.licenceCategory],
          ["Licence Validity", data.licenceValidity],
          ["Date of Issue", data.dateOfIssue],
          ["Vehicle No", data.vehicleNo],
          ["Vehicle Type", data.vehicleType],
          ["Shift Type", data.shiftType],
          ["Regional", data.region],
          ["Departure /BC", data.departureBC],
        ].map(([label, value]) => (
          <div className="table-row-modern" key={label}>
            <span className="table-label">{label}:</span>
            <span className="table-value">{value || ""}</span>
          </div>
        ))}

        {/* Valid From / Valid To - Fixed alignment */}
        <div className="table-row-modern">
          <span className="table-label">Valid From:</span>
          <span className="table-value-inline">{data.validFrom || ""}</span>
          <span className="table-label-inline">Valid To:</span>
          <span className="table-value-inline">{data.validTo || ""}</span>
        </div>
      </div>

      {/* RETURN SECTION - Bigger red text, larger address */}
      <div className="return-section-clean">
        <div className="return-title-red">If found please return to:</div>
        <img src={logo} className="card-logo-return" alt="Company Logo" />
        <div className="address-large">
          Suite No. 302-A, Sea Breeze Plaza
          <br />
          Shahrah-e-Faisal, Karachi
          <br />
          <strong>Tel:</strong> 021-32783613-4
        </div>
      </div>
    </div>
  );
};

export default CardBack;
