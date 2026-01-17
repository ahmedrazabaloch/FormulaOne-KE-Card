const VehicleForm = ({ onChange, errors = {}, values = {} }) => {
  const handleChange = (e) => {
    onChange(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="card-box">
      <h3>Vehicle Card (Back)</h3>

      <div className="grid">
        {[
          ["Vehicle No", "vehicleNo", "text"],
          ["Vehicle Type", "vehicleType", "text"],
          ["Shift Type", "shiftType", "text"],
          ["Region", "region", "text"],
          ["Departure / BC", "departureBC", "text"],
          ["Inspection ID", "inspectionId", "text"],
          ["Valid From", "validFrom", "date"],
          ["Valid To", "validTo", "date"]
        ].map(([label, name, type]) => (
          <div className="field" key={name}>
            <label>{label}</label>
            <input 
              type={type}
              name={name} 
              value={values[name] || ''}
              onChange={handleChange} 
              className={errors[name] ? 'input-error' : ''}
              placeholder={type === 'date' ? 'yyyy-mm-dd' : ''}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleForm;
