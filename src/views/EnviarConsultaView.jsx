import React, { useEffect, useState } from "react";
import { db, auth } from "../database/firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import ConsultaForm from "../components/chat/ConsultaForm";
import HistorialConsultasUsuario from "../components/chat/HistorialConsultasUsuario";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";

const EnviarConsultaView = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Esperar autenticación correctamente
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const agregarToast = (mensaje, tipo = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleSubmit = async (mensaje) => {
    if (!currentUser?.uid) return;

    if (modoEdicion) {
      try {
        await updateDoc(doc(db, "consultas", modoEdicion), {
          mensaje,
          timestamp: serverTimestamp(),
        });
        agregarToast("Consulta actualizada");
        setModoEdicion(null);
      } catch (error) {
        console.error("Error al editar:", error);
        agregarToast("Error al editar", "danger");
      }
    } else {
      try {
        await addDoc(collection(db, "consultas"), {
          uid: currentUser.uid,
          mensaje,
          respuesta: "", // Se guarda vacío
          timestamp: serverTimestamp(),
        });
        agregarToast("Consulta enviada");
      } catch (error) {
        console.error("Error al enviar:", error);
        agregarToast("Error al enviar consulta", "danger");
      }
    }
  };

  const handleEliminarConsulta = async (id) => {
    if (window.confirm("¿Eliminar esta consulta?")) {
      try {
        await deleteDoc(doc(db, "consultas", id));
        agregarToast("Consulta eliminada");
      } catch (error) {
        console.error("Error al eliminar:", error);
        agregarToast("Error al eliminar", "danger");
      }
    }
  };

  const handleEditarConsulta = (consulta) => {
    setModoEdicion(consulta.id);
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) textarea.value = consulta.mensaje;
    }, 50);
  };

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, "consultas"),
      where("uid", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConsultas(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="container mt-5 text-white text-center">
        <Spinner animation="border" variant="dark" />
        <p>Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} bg={toast.tipo} delay={3000} autohide>
            <Toast.Body className="text-black-50">{toast.mensaje}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <h2 className="text-alert-dark mb-4">
        {modoEdicion ? "Editar Consulta" : "Enviar Consulta"}
      </h2>

      <ConsultaForm onSubmit={handleSubmit} />

      {loading ? (
        <div className="text-white mt-3 text-center">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <HistorialConsultasUsuario
          consultas={consultas}
          onDelete={handleEliminarConsulta}
          onEdit={handleEditarConsulta}
        />
      )}
    </div>
  );
};

export default EnviarConsultaView;
