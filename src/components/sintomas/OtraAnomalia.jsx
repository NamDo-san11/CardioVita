const OtraAnomalia = ({ otraAnomalia, setOtraAnomalia }) => {
    return (
    <div className="mt-3">
        <label style={{color:"#26425A"}} >Otra Anomalía (Opcional):</label>
        <input
        type="text"
        className="form-control"
        value={otraAnomalia}
        onChange={(e) => setOtraAnomalia(e.target.value)}
        placeholder="Escribe aquí"
        />
    </div>
    );
};

export default OtraAnomalia;
