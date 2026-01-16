import logo from "../assets/logo.png";
import signature from "../assets/authority-signature.png";

const CardFront = ({ data, inspectionId = "", orientation = "portrait" }) => {
  return (
    <div className={`card ${orientation === 'portrait' ? 'card-portrait' : ''}`}>
      {/* LOGO */}
      <img src={logo} className="card-logo" />

      {/* PHOTO (uses global mm sizing) */}
      {data.photo && <img src={data.photo} className="employee-photo" />}

      {/* FORM FIELDS */}
      <div className="form-lines">
        {[
          ["Serial No", data.serialNo],
          ["Employee Code", data.employeeCode],
          ["Employee Name", data.employeeName],
          ["Designation", data.designation],
          ["CNIC No", data.cnic],
          ["Inspection ID", inspectionId],
        ].map(([label, value]) => (
          <div className="line" key={label}>
            <span>{label}:</span>
            <span className="underline">{value}</span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="footer">
        <strong>Deputed at: K-Electric Limited</strong>
        <div className="authority-section">
          <img src={signature} className="authority-signature" alt="Signature" />
          <div>Issue Authority</div>
        </div>
      </div>
    </div>
  );
};

export default CardFront;
