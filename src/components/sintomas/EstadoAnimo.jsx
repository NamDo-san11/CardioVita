const EstadoAnimo = ({ selected, setSelected }) => {
    const opciones = ["Tranquilo", "Feliz", "Emocionado", "Deprimido", "Decaído"];
    
    const handleChange = (opcion) => {
        setSelected((prev) =>
        prev.includes(opcion) ? prev.filter((item) => item !== opcion) : [...prev, opcion]
        );
        };
    
        return (
        <div className="mt-3">
            <h5>Estado de Ánimo</h5>
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

export default EstadoAnimo;