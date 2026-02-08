import logo from "../assets/logo.png";

const CardBack = ({ data, orientation = "portrait" }) => {
  return (
    <div className={`card-modern ${orientation === 'portrait' ? 'card-portrait' : ''}`}>
      <div className="card-back-header">
        <h3>Vehicle Deputed on KE Duty</h3>
      </div>

      <div className="form-lines-modern">
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
          <div className="line-modern" key={label}>
            <span className="label-modern">{label}:</span>
            <span className="value-modern">{value}</span>
          </div>
        ))}

        <div className="valid-row-modern">
          <span className="valid-label-modern">Valid From:</span>
          <span className="value-modern inline-value">{data.validFrom}</span>
          <span className="valid-label-modern">Valid To:</span>
          <span className="value-modern inline-value">{data.validTo}</span>
        </div>
      </div>

      <div className="return-section-modern">
        <div className="return-title-modern">If found please return to:</div>
        <img src={logo} className="card-logo-modern small" alt="Company Logo" />
        <div className="address-modern">
          Suite No. 302-A, Sea Breeze Plaza
          <br />
          Shahrah-e-Faisal, Karachi
          <br />
          Tel: 021-32783613-4
        </div>
      </div>
    </div>
  );
};

export default CardBack;
