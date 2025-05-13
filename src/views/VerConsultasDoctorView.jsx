import React, { useEffect, useState } from "react";
import { db } from "../database/firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  query
} from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import ConsultaCardDoctor from "../components/chat/ConsultaCardDoctor";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";

const VerConsultasDoctorView = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const agregarToast = (mensaje, tipo = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleResponder = async (id, respuesta) => {
    try {
      await updateDoc(doc(db, "consultas", id), { respuesta });
      agregarToast("Respuesta guardada");
    } catch (error) {
      console.error("Error al responder:", error);
      agregarToast("Error al guardar respuesta", "danger");
    }
  };

useEffect(() => {
  const q = query(collection(db, "consultas"), orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const consultasBase = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Para cada consulta, obtener los datos del usuario
    const consultasConUsuario = await Promise.all(
      consultasBase.map(async (consulta) => {
        try {
          const userDoc = await getDoc(doc(db, "usuarios", consulta.uid));
          if (userDoc.exists()) {
            const { nombre, edad } = userDoc.data();
            return {
              ...consulta,
              nombre: nombre || "Desconocido",
              edad: edad ? parseInt(edad) + 1 : "N/D",
            };
          } else {
            return {
              ...consulta,
              nombre: "Desconocido",
              edad: "N/D",
            };
          }
        } catch (error) {
          console.error("Error al obtener usuario:", error);
          return {
            ...consulta,
            nombre: "Error al cargar",
            edad: "N/D",
          };
        }
      })
    );

    setConsultas(consultasConUsuario);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);


  return (
    <div className="container mt-4">
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} bg={toast.tipo} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.mensaje}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <h2 className="text-white mb-4">Consultas de Usuarios</h2>

      {loading ? (
        <div className="text-white text-center">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        consultas.map((consulta) => (
          <ConsultaCardDoctor
            key={consulta.id}
            consulta={consulta}
            onResponder={handleResponder}
          />
        ))
      )}
    </div>
  );
};

export default VerConsultasDoctorView;