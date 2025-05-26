import React, { useEffect, useState } from "react";
import { db, auth } from "../database/firebaseconfig";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc
} from "firebase/firestore";
import { Container, Spinner, Row, Col, Alert } from "react-bootstrap";
import { useAuth } from "../database/authcontext";
import DoctorEstadoCard from "../components/teleconsultas/DoctorEstadoCard";
import FormularioCrearPerfil from "../components/perfil/FormularioCrearPerfil";
import SolicitudCard from "../components/teleconsultas/SolicitudCard";

const DoctorEstadoView = () => {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [estado, setEstado] = useState("inactivo");
  const [loading, setLoading] = useState(true);
  const [solicitudes, setSolicitudes] = useState([]);

  const uid = user?.uid;
  const perfilRef = doc(db, "usuarios", uid);
  const estadoRef = doc(db, "estado_doctores", uid);

  // Cargar perfil y estado
  useEffect(() => {
    const cargarPerfilYEstado = async () => {
      try {
        const perfilSnap = await getDoc(perfilRef);
        if (perfilSnap.exists()) {
          const perfilData = perfilSnap.data();
          setPerfil(perfilData);

          const estadoSnap = await getDoc(estadoRef);
          if (estadoSnap.exists()) {
            setEstado(estadoSnap.data().estado);
          } else {
            await setDoc(estadoRef, {
              uid,
              nombre: perfilData.nombre,
              especialidad: perfilData.especialidad,
              estado: "inactivo",
            });
            setEstado("inactivo");
          }
        } else {
          setPerfil(null); // mostrará formulario
        }
      } catch (error) {
        console.error("Error cargando perfil o estado:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uid) cargarPerfilYEstado();
  }, [uid]);

  // Escuchar solicitudes en tiempo real
  useEffect(() => {
  const q = query(
    collection(db, "teleconsultas"),
    where("idDoctor", "==", uid),
    where("estado", "in", ["pendiente", "activa"]) // incluir activas
  );

  const unsub = onSnapshot(q, (snapshot) => {
    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setSolicitudes(lista);
  });

  return () => unsub();
}, [uid]);


  const guardarPerfil = async ({ nombre, especialidad }) => {
    try {
      await setDoc(perfilRef, {
        uid,
        correo: user.email,
        nombre,
        especialidad,
        rol: "doctor",
      });

      await setDoc(estadoRef, {
        uid,
        nombre,
        especialidad,
        estado: "inactivo",
      });

      setPerfil({ nombre, especialidad, rol: "doctor" });
      setEstado("inactivo");
    } catch (error) {
      console.error("Error guardando perfil:", error);
    }
  };

  const cambiarEstado = async () => {
    const nuevoEstado = estado === "activo" ? "inactivo" : "activo";
    try {
      await setDoc(estadoRef, {
        uid,
        nombre: perfil.nombre,
        especialidad: perfil.especialidad,
        estado: nuevoEstado,
      });
      setEstado(nuevoEstado);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

const aceptarConsulta = async (solicitud) => {
  try {
    const roomId = `sala-${solicitud.id}`; // nombre único
    const link = `https://meet.jit.si/${roomId}`;

    await updateDoc(doc(db, "teleconsultas", solicitud.id), {
      estado: "activa",
      salaVideo: link,
    });

    alert("Consulta aceptada. Videollamada lista.");
  } catch (error) {
    console.error("Error al aceptar consulta:", error);
  }
};

const finalizarConsulta = async (solicitud) => {
  try {
    await updateDoc(doc(db, "teleconsultas", solicitud.id), {
      estado: "finalizada",
    });
    alert("Consulta finalizada correctamente.");
  } catch (error) {
    console.error("Error al finalizar consulta:", error);
  }
};

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando información del doctor...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {!perfil ? (
        <div className="d-flex justify-content-center">
          <FormularioCrearPerfil onGuardar={guardarPerfil} />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-center mb-4">
            <DoctorEstadoCard
              nombre={perfil.nombre}
              especialidad={perfil.especialidad}
              estado={estado}
              onToggle={cambiarEstado}
            />
          </div>

          <h4 className="text-center mb-3">Solicitudes Recibidas</h4>
          {solicitudes.length === 0 ? (
            <Alert variant="info" className="text-center">
              No tienes solicitudes pendientes.
            </Alert>
          ) : (
            <Row className="justify-content-center">
              {solicitudes.map((s) => (
                <Col md={6} lg={5} key={s.id}>
                 <SolicitudCard
                  solicitud={s}
                  onAceptar={aceptarConsulta}
                  onFinalizar={finalizarConsulta}
                />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default DoctorEstadoView;
