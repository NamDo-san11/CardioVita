import { useEffect, useState } from "react";
import { db, auth } from "../../database/firebaseconfig";
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

  const validarTexto = (texto) => {
    const soloTexto = /^[a-zA-ZÀ-ſ\s.,!?()\-]{0,200}$/;
    return texto === "" || soloTexto.test(texto);
  };

  const handleGuardarRespuestas = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para guardar tu registro.");
      return;
    }

    if (!validarTexto(otraAnomalia)) {
      alert("La descripción en 'Otra Anomalía' contiene caracteres inválidos.");
      return;
    }

    const data = {
      uid: user.uid,
      estadoAnimo,
      sintomas,
      actividadFisica,
      otraAnomalia,
      fecha: new Date().toISOString().split("T")[0],
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
    <div className="container mt-4 principal-edit">
      <h2 style={{color:"#26425A"}}>{datosIniciales ? "Editar Registro" : "Nuevo Cuestionario"}</h2>
      <EstadoAnimo selected={estadoAnimo} setSelected={setEstadoAnimo} />
      <Sintomas selected={sintomas} setSelected={setSintomas} />
      <ActividadFisica selected={actividadFisica} setSelected={setActividadFisica} />
      <OtraAnomalia otraAnomalia={otraAnomalia} setOtraAnomalia={setOtraAnomalia} />
      <button className="btn btn-outline-success mt-3"  onClick={handleGuardarRespuestas}>
        {datosIniciales ? "Actualizar" : "Guardar Respuestas"}
      </button>
    </div>
  );
};

export default Cuestionario;
