import logo from "../assets/logo.png";

const CardBack = ({ data, orientation = "portrait" }) => {
  return (
    <div className={`card ${orientation === 'portrait' ? 'card-portrait' : ''}`}>
      <h3>Vehicle Deputed on KE Duty</h3>

      <div className="form-lines">
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
          <div className="line" key={label}>
            <span>{label}:</span>
            <span className="underline">{value}</span>
          </div>
        ))}

        <div className="valid-row">
          <span className="valid-label">Valid From:</span>
          <span className="underline inline-underline">{data.validFrom}</span>
          <span className="valid-label">Valid To:</span>
          <span className="underline inline-underline">{data.validTo}</span>
        </div>
      </div>

      <div className="return-section">
        <div className="return-title">If found please return to:</div>
        <img src={logo} className="card-logo" />
        <div className="address">
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
