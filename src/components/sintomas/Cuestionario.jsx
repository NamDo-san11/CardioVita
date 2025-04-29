import { useEffect, useState } from "react";
import EstadoAnimo from "./EstadoAnimo";
import Sintomas from "./Sintomas";
import ActividadFisica from "./ActividadFisica";
import OtraAnomalia from "./OtraAnomalia";

const Cuestionario = ({ datosIniciales = null, onGuardar, onCancelar }) => {
  const [estadoAnimo, setEstadoAnimo] = useState([]);
  const [sintomas, setSintomas] = useState([]);
  const [actividadFisica, setActividadFisica] = useState([]);
  const [otraAnomalia, setOtraAnomalia] = useState("");

  useEffect(() => {
    if (datosIniciales) {
      setEstadoAnimo(datosIniciales.estadoAnimo || []);
      setSintomas(datosIniciales.sintomas || []);
      setActividadFisica(datosIniciales.actividadFisica || []);
      setOtraAnomalia(datosIniciales.otraAnomalia || "");
    }
  }, [datosIniciales]);

  const validarTexto = (texto) => {
    const soloTexto = /^[a-zA-ZÀ-ſ\s.,!?()\-]{0,200}$/;
    return texto === "" || soloTexto.test(texto);
  };

  const handleSubmit = () => {
    if (!validarTexto(otraAnomalia)) {
      alert("La descripción en 'Otra Anomalía' contiene caracteres inválidos.");
      return;
    }

    const datos = {
      estadoAnimo,
      sintomas,
      actividadFisica,
      otraAnomalia,
    };

    onGuardar(datos);
  };

  return (
    <div className="container mt-4 principal-edit">
      <h2 style={{color:"#26425A"}}>{datosIniciales ? "Editar Registro" : "Nuevo Cuestionario"}</h2>
      <EstadoAnimo selected={estadoAnimo} setSelected={setEstadoAnimo} />
      <Sintomas selected={sintomas} setSelected={setSintomas} />
      <ActividadFisica selected={actividadFisica} setSelected={setActividadFisica} />
      <OtraAnomalia otraAnomalia={otraAnomalia} setOtraAnomalia={setOtraAnomalia} />
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-outline-success" onClick={handleSubmit}>
          {datosIniciales ? "Actualizar" : "Guardar Respuestas"}
        </button>
        <button className="btn btn-outline-secondary" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Cuestionario;
