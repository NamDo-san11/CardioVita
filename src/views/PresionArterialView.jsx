import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TarjetaNormativa from "../components/presion/TarjetaNormativa";
import TarjetaInformativa from "../components/presion/TarjetaInformativa";
import ModalPresion from "../components/presion/ModalPresion";
import ListadoPresiones from "../components/presion/ListadoPresiones";
import { db, auth } from "../database/firebaseconfig";
import  ReactGA  from "react-ga4";
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import "../styles/PresionArterial.css";

const PresionArterialView = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosEditar, setDatosEditar] = useState(null);
  const [ultimaPresion, setUltimaPresion] = useState(null);
  const [resumenPresion, setResumenPresion] = useState(null);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    // ?Iniciar Analityc la app
    ReactGA.initialize("G-ZPQ0YG91K6");
  
    ReactGA.send({
      hitType: 'pageview',
      page: window.location.pathname,
      title: 'PresionArterialView.jsx'
    })
  }, []);
  const cargarDatos = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const snapshot = await getDocs(collection(db, "presion_arterial"));
    const registrosFiltrados = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(r => r.uid === user.uid)
      .sort((a, b) => new Date(b.fecha + 'T' + b.hora) - new Date(a.fecha + 'T' + a.hora));

    setRegistros(registrosFiltrados);

    if (registrosFiltrados.length > 0) {
      setUltimaPresion(registrosFiltrados[0]);
      const resumen = { normal: 0, elevada: 0, alta: 0 };
      registrosFiltrados.forEach(r => {
        const rango = r.rango?.toLowerCase();
        if (resumen[rango] !== undefined) resumen[rango]++;
      });
      setResumenPresion(resumen);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardarPresion = async (datos) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para guardar tu presión arterial.");
      return;
    }

    const data = {
      ...datos,
      uid: user.uid,
      timestamp: serverTimestamp(),
    };

    try {
      if (datosEditar && datosEditar.id) {
        await setDoc(doc(db, "presion_arterial", datosEditar.id), data);
        alert("Registro actualizado exitosamente.");
      } else {
        await addDoc(collection(db, "presion_arterial"), data);
        alert("Registro guardado exitosamente.");
      }
      setMostrarModal(false);
      setDatosEditar(null);
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar la presión arterial:", error);
    }
  };

  const handleEliminarPresion = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      await deleteDoc(doc(db, "presion_arterial", id));
      cargarDatos();
    }
  };

  return (
    <Container className="presion-container mt-4">
      <br />
      <br />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-edit">Presión Arterial</h2>
        <Button variant="success" onClick={() => {
          setDatosEditar(null);
          setMostrarModal(true);
        }}>
          + Agregar
        </Button>
      </div>

      <Row>
        <Col md={12} className="mb-3">
          <TarjetaNormativa ultima={ultimaPresion} resumen={resumenPresion} />
        </Col>
        <Col md={12} className="mb-4">
          <TarjetaInformativa />
        </Col>
        <Col md={12}>
          <ListadoPresiones
            registros={registros}
            onEdit={(registro) => {
              setDatosEditar(registro);
              setMostrarModal(true);
            }}
            onDelete={handleEliminarPresion}
          />
        </Col>
      </Row>

      <ModalPresion
        show={mostrarModal}
        onHide={() => {
          setMostrarModal(false);
          setDatosEditar(null);
        }}
        onGuardar={handleGuardarPresion}
        datosIniciales={datosEditar}
      />
    </Container>
  );
};

export default PresionArterialView;
