import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { db, auth } from "../database/firebaseconfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import DoctorDisponibleCard from "../components/teleconsultas/DoctorDisponibleCard";
import ModalSolicitarConsulta from "../components/teleconsultas/ModalSolicitarConsulta";

const ListaDoctoresDisponiblesView = () => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfilVerificado, setPerfilVerificado] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);

  // Verificar o crear perfil del paciente
  useEffect(() => {
    const verificarOCrearPerfil = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, {
            uid: user.uid,
            correo: user.email,
            nombre: user.displayName || "Paciente",
            rol: "usuario",
            timestamp: serverTimestamp(),
          });
          console.log("Perfil de paciente creado automáticamente.");
        }
        setPerfilVerificado(true);
      } catch (error) {
        console.error("Error verificando o creando perfil:", error);
      }
    };

    verificarOCrearPerfil();
  }, []);

  // Obtener doctores activos
  useEffect(() => {
    const obtenerDoctores = async () => {
      try {
        const q = query(collection(db, "estado_doctores"), where("estado", "==", "activo"));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctores(lista);
      } catch (error) {
        console.error("Error al obtener doctores activos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDoctores();
  }, []);

  // Enviar la solicitud a la colección teleconsultas
  const enviarSolicitud = async ({ mensaje }) => {
    const paciente = auth.currentUser;
    if (!paciente || !doctorSeleccionado) return;

    try {
      const pacienteSnap = await getDoc(doc(db, "usuarios", paciente.uid));
      if (!pacienteSnap.exists()) {
        alert("Tu perfil no está completo.");
        return;
      }

      const datosPaciente = pacienteSnap.data();

      await addDoc(collection(db, "teleconsultas"), {
        idDoctor: doctorSeleccionado.uid,
        nombreDoctor: doctorSeleccionado.nombre,
        idPaciente: paciente.uid,
        nombrePaciente: datosPaciente.nombre,
        mensaje,
        fecha: serverTimestamp(),
        estado: "pendiente",
        salaVideo: null,
      });

      alert("Solicitud enviada correctamente.");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("No se pudo enviar la solicitud.");
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Doctores Disponibles</h2>

      {!perfilVerificado ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Verificando perfil de usuario...</p>
        </div>
      ) : loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : doctores.length === 0 ? (
        <Alert variant="info" className="text-center">
          No hay doctores activos en este momento.
        </Alert>
      ) : (
        <Row className="justify-content-center">
          {doctores.map((doctor) => (
            <Col md={6} lg={4} key={doctor.id}>
              <DoctorDisponibleCard
                nombre={doctor.nombre}
                especialidad={doctor.especialidad}
                onSolicitar={() => {
                  setDoctorSeleccionado(doctor);
                  setModalVisible(true);
                }}
              />
            </Col>
          ))}
        </Row>
      )}

      {modalVisible && doctorSeleccionado && (
        <ModalSolicitarConsulta
          show={modalVisible}
          onClose={() => setModalVisible(false)}
          doctor={doctorSeleccionado}
          onEnviar={enviarSolicitud}
        />
      )}
    
    </Container>
  );
};

export default ListaDoctoresDisponiblesView;
