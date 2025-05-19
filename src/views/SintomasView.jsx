import { useState, useEffect } from "react";
import { Container, Button, ToastContainer, Toast } from "react-bootstrap";
import { db, auth } from "../database/firebaseconfig";
import { collection, onSnapshot, addDoc, setDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import Cuestionario from "../components/sintomas/Cuestionario";
import HistorialSintomas from "../components/sintomas/HistorialSintomas";
import "../styles/SintomasView.css";
import ReactGA from "react-ga4";

const SintomasView = () => {
  const [mostrarCuestionario, setMostrarCuestionario] = useState(false);
  const [datosEditar, setDatosEditar] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [toasts, setToasts] = useState([]);
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    ReactGA.initialize("G-ZPQ0YG91K6");
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "PresionArterialView.jsx",
    });
  }, []);


  const agregarToast = (mensaje, tipo) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(db, "cuestionario_sintomas");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const fetched = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(r => r.uid === user.uid)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      setRegistros(fetched);
    }, (error) => {
      console.error("Error al cargar cuestionarios:", error);
      agregarToast("Error al cargar datos", "danger");
    });

    return () => unsubscribe();
  }, []);

  const handleGuardarSintoma = async (datos) => {
    const user = auth.currentUser;
    if (!user) {
      agregarToast("Debes iniciar sesión", "danger");
      return;
    }

    const data = {
      ...datos,
      uid: user.uid,
      fecha: new Date().toISOString().split("T")[0],
      timestamp: serverTimestamp(),
    };

    if (datosEditar && datosEditar.id) {
      setRegistros(prev => prev.map(r => r.id === datosEditar.id ? { ...r, ...datos } : r));
      try {
        await setDoc(doc(db, "cuestionario_sintomas", datosEditar.id), data);
        agregarToast("Registro actualizado", "success");
      } catch (error) {
        console.error("Error al actualizar:", error);
        agregarToast(isOffline ? "Actualización pendiente" : "Error al actualizar", isOffline ? "warning" : "danger");
      }
    } else {
      const tempId = `temp_${Date.now()}`;
      const nuevoRegistro = { ...datos, id: tempId };
      setRegistros(prev => [nuevoRegistro, ...prev]);
      try {
        await addDoc(collection(db, "cuestionario_sintomas"), data);
        agregarToast("Registro agregado", "success");
      } catch (error) {
        console.error("Error al agregar:", error);
        agregarToast(isOffline ? "Registro pendiente" : "Error al guardar", isOffline ? "warning" : "danger");
      }
    }

    setMostrarCuestionario(false);
    setDatosEditar(null);
  };

  const handleEliminarSintoma = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      setRegistros(prev => prev.filter(r => r.id !== id));
      try {
        await deleteDoc(doc(db, "cuestionario_sintomas", id));
        agregarToast("Registro eliminado", "success");
      } catch (error) {
        console.error("Error al eliminar:", error);
        agregarToast(isOffline ? "Eliminación pendiente" : "Error al eliminar", isOffline ? "warning" : "danger");
      }
    }
  };

  return (
    <Container className="sintomas-container mt-4">
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} bg={toast.tipo} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.mensaje}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <h2 className="fw-bold text-edit">Registro de Síntomas</h2>
      {mostrarCuestionario ? (
        <Cuestionario
          datosIniciales={datosEditar}
          onGuardar={handleGuardarSintoma}
          onCancelar={() => { setMostrarCuestionario(false); setDatosEditar(null); }}
        />
      ) : (
        <>
          <Button variant="outline-success" className="mb-3" onClick={() => {
            setDatosEditar(null);
            setMostrarCuestionario(true);
          }}>
            + Agregar Registro
          </Button>
          <HistorialSintomas
            registros={registros}
            onEdit={(registro) => {
              setDatosEditar(registro);
              setMostrarCuestionario(true);
            }}
            onDelete={handleEliminarSintoma}
          />
        </>
      )}
    </Container>
  );
};

export default SintomasView;
