const Sintomas = ({ selected, setSelected }) => {
    const opciones = ["🤕 Dolor de cabeza", "😵‍💫 Mareos", "🫨 Fatiga", "🩸Sangrado nasal", "🤢 Náuseas"];
    
        const handleChange = (opcion) => {
        setSelected((prev) =>
            prev.includes(opcion) ? prev.filter((item) => item !== opcion) : [...prev, opcion]
        );
        };
    
        return (
        <div className="mt-3">
            <h5 style={{color:"#26425A"}}>Síntomas</h5>
            {opciones.map((opcion) => (
            <div key={opcion} className="form-check">
                <input
                type="checkbox"
                className="form-check-input"
                id={opcion}
                checked={selected.includes(opcion)}
                onChange={() => handleChange(opcion)}
                />
                <label className="form-check-label" htmlFor={opcion}>{opcion}</label>
            </div>
            ))}
        </div>
        );
    };

export default Sintomas;  