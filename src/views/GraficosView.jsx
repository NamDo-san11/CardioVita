import React, { useEffect, useState } from "react";
import { auth, db } from "../database/firebaseconfig";
import { collection, onSnapshot } from "firebase/firestore";
import Graficos from "../components/graficos/Graficos";
import "../styles/GraficosView.css";

const GraficosView = () => {
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "presion_arterial");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const fetched = snapshot.docs
        .map(doc => {
          const data = { id: doc.id, ...doc.data() };
          const fechaHora = new Date(`${data.fecha}T${data.hora.length === 5 ? data.hora + ":00" : data.hora}`);
          return { ...data, fechaHora };
        })
        .filter(r => r.uid === user.uid)
        .sort((a, b) => b.fechaHora - a.fechaHora);

      setRegistros(fetched);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="graficos-view">
      <h2>Estadísticas de Presión Arterial</h2>
      {registros.length > 0 ? (
        <Graficos registros={registros} />
      ) : (
        <p>Cargando registros...</p>
      )}
    </div>
  );
};

export default GraficosView;
