import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import TarjetaNormativa from "../components/presion/TarjetaNormativa";
import TarjetaInformativa from "../components/presion/TarjetaInformativa";
import ModalPresion from "../components/presion/ModalPresion";
import ModalCompartirReportePrecion from "../components/reporte/ModalCompartirReportePrecion";
import ListadoPresiones from "../components/presion/ListadoPresiones";
import { db, auth } from "../database/firebaseconfig";
import ReactGA from "react-ga4";
import { collection, onSnapshot, addDoc, setDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { FaShareAlt } from "react-icons/fa";
import "../styles/PresionArterial.css";

const PresionArterialView = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalCompartir, setMostrarModalCompartir] = useState(false);
  const [datosEditar, setDatosEditar] = useState(null);
  const [ultimaPresion, setUltimaPresion] = useState(null);
  const [resumenPresion, setResumenPresion] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [filtro, setFiltro] = useState("todo");

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

      if (fetched.length > 0) {
        setUltimaPresion(fetched[0]);
        const resumen = { normal: 0, elevada: 0, alta: 0 };
        fetched.forEach(r => {
          const rango = r.rango?.toLowerCase();
          if (resumen[rango] !== undefined) resumen[rango]++;
        });
        setResumenPresion(resumen);
      }
    }, (error) => {
      console.error("Error al cargar datos de presión arterial:", error);
      if (isOffline) {
        console.log("Offline: mostrando datos en caché local.");
      } else {
        alert("Error al cargar datos: " + error.message);
      }
    });

    return () => unsubscribe();
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

    if (datosEditar && datosEditar.id) {
      setRegistros(prev => prev.map(r => r.id === datosEditar.id ? { ...r, ...datos } : r));
      try {
        await setDoc(doc(db, "presion_arterial", datosEditar.id), data);
        alert("Registro actualizado exitosamente.");
      } catch (error) {
        console.error("Error al actualizar:", error);
        alert(isOffline ? "Sin conexión: se actualizará al reconectar." : "Error al actualizar: " + error.message);
      }
    } else {
      const tempId = `temp_${Date.now()}`;
      const nuevoRegistro = {
        ...datos,
        id: tempId,
        fechaHora: new Date(`${datos.fecha}T${datos.hora.length === 5 ? datos.hora + ":00" : datos.hora}`)
      };
      setRegistros(prev => [nuevoRegistro, ...prev]);
      try {
        await addDoc(collection(db, "presion_arterial"), data);
        alert("Registro guardado exitosamente.");
      } catch (error) {
        console.error("Error al guardar:", error);
        alert(isOffline ? "Sin conexión: se guardará al reconectar." : "Error al guardar: " + error.message);
      }
    }

    setMostrarModal(false);
    setDatosEditar(null);
  };

  const handleEliminarPresion = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      setRegistros(prev => prev.filter(r => r.id !== id));
      try {
        await deleteDoc(doc(db, "presion_arterial", id));
        alert("Registro eliminado exitosamente.");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert(isOffline ? "Sin conexión: eliminación pendiente de sincronizar." : "Error al eliminar: " + error.message);
      }
    }
  };

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
        <div className="d-flex gap-2">
          <Button variant="info" onClick={() => setMostrarModalCompartir(true)}>
            <FaShareAlt /> Compartir Reporte
          </Button>
          <Button variant="success" onClick={() => {
            setDatosEditar(null);
            setMostrarModal(true);
          }}>
            + Agregar
          </Button>
        </div>
      </div>

      <Row>
        <Col md={12} className="mb-3">
          <TarjetaNormativa registros={registros} resumen={resumenPresion} />
        </Col>
        <Col md={12} className="mb-4">
          <TarjetaInformativa />
        </Col>
        <Col md={12}>
          <div className="mb-4">
            <Button variant={filtro === "todo" ? "dark" : "outline-dark"} onClick={() => setFiltro("todo")} className="me-2">Todo</Button>
            <Button variant={filtro === "mes" ? "dark" : "outline-dark"} onClick={() => setFiltro("mes")} className="me-2">Este Mes</Button>
            <Button variant={filtro === "semana" ? "dark" : "outline-dark"} onClick={() => setFiltro("semana")}>Esta Semana</Button>
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

      <ModalCompartirReportePrecion
        show={mostrarModalCompartir}
        onClose={() => setMostrarModalCompartir(false)}
        registros={registrosFiltrados}
      />
    </Container>
  );
};

export default PresionArterialView;
