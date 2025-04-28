import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TarjetaNormativa from "../components/presion/TarjetaNormativa";
import TarjetaInformativa from "../components/presion/TarjetaInformativa";
import ModalPresion from "../components/presion/ModalPresion";
import ListadoPresiones from "../components/presion/ListadoPresiones";
import { db, auth } from "../database/firebaseconfig";
import ReactGA from "react-ga4";
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import "../styles/PresionArterial.css";

const PresionArterialView = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosEditar, setDatosEditar] = useState(null);
  const [ultimaPresion, setUltimaPresion] = useState(null);
  const [resumenPresion, setResumenPresion] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [filtro, setFiltro] = useState("todo");

  // Detectar online/offline
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

  // Google Analytics
  useEffect(() => {
    ReactGA.initialize("G-ZPQ0YG91K6");
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "PresionArterialView.jsx",
    });
  }, []);

  const cargarDatos = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snapshot = await getDocs(collection(db, "presion_arterial"));
    const registrosFiltrados = snapshot.docs
      .map(doc => {
        const data = { id: doc.id, ...doc.data() };
        const fechaHora = new Date(`${data.fecha}T${data.hora.length === 5 ? data.hora + ":00" : data.hora}`);
        return { ...data, fechaHora };
      })
      .filter(r => r.uid === user.uid)
      .sort((a, b) => b.fechaHora - a.fechaHora);

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

  // Aplicar filtros
  const registrosFiltrados = registros.filter(r => {
    if (filtro === "todo") return true;

    const ahora = new Date();
    const fecha = r.fechaHora;

    if (filtro === "mes") {
      return fecha.getFullYear() === ahora.getFullYear() && fecha.getMonth() === ahora.getMonth();
    }

    if (filtro === "semana") {
      const primerDiaSemana = new Date(ahora);
      primerDiaSemana.setDate(ahora.getDate() - ahora.getDay());

      const ultimoDiaSemana = new Date(primerDiaSemana);
      ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);

      return fecha >= primerDiaSemana && fecha <= ultimoDiaSemana;
    }

    return true;
  });

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

        {/* Filtros */}
      <div className="mb-4">
        <Button
          variant={filtro === "todo" ? "dark" : "outline-dark"}
          onClick={() => setFiltro("todo")}
          className="me-2"
        >
          Todo
        </Button>
        <Button
          variant={filtro === "mes" ? "dark" : "outline-dark"}
          onClick={() => setFiltro("mes")}
          className="me-2"
        >
          Este Mes
        </Button>
        <Button
          variant={filtro === "semana" ? "dark" : "outline-dark"}
          onClick={() => setFiltro("semana")}
        >
          Esta Semana
        </Button>
      </div>
      
          <ListadoPresiones
            registros={registrosFiltrados}
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
