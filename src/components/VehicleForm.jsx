const VehicleForm = ({ onChange, errors = {}, values = {} }) => {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const formatMonthYear = (value) => {
    if (!value) return "";
    const [y, m] = value.split("-").map(Number);
    const month = monthNames[(m || 1) - 1];
    return `${month}-${y}`;
  };

  const addOneYear = (value) => {
    if (!value) return "";
    const [y, m] = value.split("-").map(Number);
    const date = new Date(y, (m || 1) - 1, 1);
    date.setFullYear(date.getFullYear() + 1);
    const fy = date.getFullYear();
    const fm = date.getMonth() + 1;
    const mm = fm.toString().padStart(2, "0");
    return formatMonthYear(`${fy}-${mm}`);
  };

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
          ["Valid From", "validFrom", "month"],
          ["Valid To", "validTo", "month"]
        ].map(([label, name, type]) => (
          <div className="field" key={name}>
            <label>{label}</label>
            {type !== 'month' ? (
              <input 
                type={type}
                name={name} 
                value={values[name] || ''}
                onChange={handleChange} 
                className={errors[name] ? 'input-error' : ''}
              />
            ) : (
              <input
                type="month"
                name={name}
                value={(values[name] && /^[A-Za-z]{3}-\d{4}$/.test(values[name])) ?
                  (() => {
                    const [mm, yy] = values[name].split('-');
                    const idx = monthNames.indexOf(mm) + 1;
                    const m2 = idx.toString().padStart(2, '0');
                    return `${yy}-${m2}`;
                  })() : (values[name] || '')}
                onChange={(e) => {
                  const raw = e.target.value;
                  const formatted = formatMonthYear(raw);
                  if (e.target.name === 'validFrom') {
                    const autoTo = addOneYear(raw);
                    onChange(prev => ({ ...prev, validFrom: formatted, validTo: autoTo }));
                  } else {
                    onChange(prev => ({ ...prev, validTo: formatted }));
                  }
                }}
                className={errors[name] ? 'input-error' : ''}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleForm;
