import { useEffect, useState } from "react";
import { db } from "../../database/firebaseconfig";
import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import EstadoAnimo from "./EstadoAnimo";
import Sintomas from "./Sintomas";
import ActividadFisica from "./ActividadFisica";
import OtraAnomalia from "./OtraAnomalia";

const Cuestionario = ({ datosIniciales = null, onFinish }) => {
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

  const handleGuardarRespuestas = async () => {
    const data = {
      estadoAnimo,
      sintomas,
      actividadFisica,
      otraAnomalia,
      fecha: new Date().toISOString().split("T")[0], // YYYY/MM/DD
      timestamp: serverTimestamp(),
    };

    try {
      if (datosIniciales && datosIniciales.id) {
        await setDoc(doc(db, "cuestionario_sintomas", datosIniciales.id), data);
        alert("Respuestas actualizadas correctamente!");
      } else {
        await addDoc(collection(db, "cuestionario_sintomas"), data);
        alert("Respuestas guardadas exitosamente!");
      }
      onFinish && onFinish();
    } catch (error) {
      console.error("Error al guardar respuestas: ", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{datosIniciales ? "Editar Registro" : "Nuevo Cuestionario"}</h2>
      <EstadoAnimo selected={estadoAnimo} setSelected={setEstadoAnimo} />
      <Sintomas selected={sintomas} setSelected={setSintomas} />
      <ActividadFisica selected={actividadFisica} setSelected={setActividadFisica} />
      <OtraAnomalia otraAnomalia={otraAnomalia} setOtraAnomalia={setOtraAnomalia} />
      <button className="btn btn-primary mt-3" onClick={handleGuardarRespuestas}>
        {datosIniciales ? "Actualizar" : "Guardar Respuestas"}
      </button>
    </div>
  );
};

export default Cuestionario;
