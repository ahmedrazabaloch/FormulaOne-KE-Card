import logo from "../assets/logo.png";
import signature from "../assets/authority-signature.png";

const CardFront = ({ data, inspectionId = "", orientation = "portrait" }) => {
  return (
    <div className={`card-modern ${orientation === 'portrait' ? 'card-portrait' : ''}`}>
      {/* LOGO */}
      <div className="card-logo-section">
        <img src={logo} className="card-logo-modern" alt="Company Logo" />
      </div>

      {/* PHOTO */}
      {data.photo && (
        <div className="card-photo-section">
          <img src={data.photo} className="employee-photo-modern" alt="Employee" />
        </div>
      )}

      {/* FORM FIELDS */}
      <div className="form-lines-modern">
        {[
          ["Serial No", data.serialNo],
          ["Employee Code", data.employeeCode],
          ["Employee Name", data.employeeName],
          ["Designation", data.designation],
          ["CNIC No", data.cnic],
          ["Inspection ID", inspectionId],
        ].map(([label, value]) => (
          <div className="line-modern" key={label}>
            <span className="label-modern">{label}:</span>
            <span className="value-modern">{value}</span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="footer-modern">
        <div className="deputed-section">
          <strong>Deputed at: K-Electric Limited</strong>
        </div>
        <div className="authority-section-modern">
          <img src={signature} className="authority-signature-modern" alt="Signature" />
          <div className="authority-text">Issue Authority</div>
        </div>
      </div>
    </div>
  );
};

export default CardFront;
