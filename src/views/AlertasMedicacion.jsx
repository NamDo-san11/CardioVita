import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, updateDoc, deleteDoc, doc, } from "firebase/firestore";
import ReactGA from "react-ga4";
import { useAuth } from "../database/authcontext";


    import TablaMedicaciones from "../components/medicaciones/TablaMedicaciones";
    import ModalRegistroMedicacion from "../components/medicaciones/ModalRegistroMedicacion";
    import ModalEdicionMedicacion from "../components/medicaciones/ModalEdicionMedicacion";
    import ModalEliminacionMedicacion from "../components/medicaciones/ModalEliminacionMedicacion";

    const AlertasMedicacion = () => {
        const { user } = useAuth(); // ⬅️ Obtenés el usuario desde el contexto
        const uid = user?.uid;     

    const [medicaciones, setMedicaciones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [medicacionEditada, setMedicacionEditada] = useState(null);
    const [medicacionAEliminar, setMedicacionAEliminar] = useState(null);
    const [searchText, setSearchText] = useState("");

    // Inicializar Google Analytics
    useEffect(() => {
        ReactGA.initialize("G-ZPQ0YG91K6");
        ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
        title: "AlertasMedicacion.jsx",
        });
    }, []);

    // Función para cargar las medicaciones del usuario
    const cargarMedicaciones = async () => {
        try {
        const querySnapshot = await getDocs(collection(db, "medicaciones"));
        const datos = querySnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((doc) => doc.uid === uid);
        setMedicaciones(datos);
        } catch (error) {
        console.error("Error al cargar medicaciones:", error);
        }
    };

    // Cargar medicaciones al inicio
    useEffect(() => {
        if (uid) {
        cargarMedicaciones();
        }
    }, [uid]);

    // Alertas automáticas
    useEffect(() => {
        const intervalo = setInterval(() => {
        const ahora = new Date();
        const fechaHoy = ahora.toISOString().split("T")[0];

        medicaciones.forEach((med) => {
            const [hora, minuto] = med.hora.split(":").map(Number);
            const horaMed = new Date();
            horaMed.setHours(hora, minuto, 0, 0);

            const diferencia = Math.abs(horaMed - ahora);

            if (
            diferencia < 60000 &&
            !med.tomado &&
            fechaHoy >= med.fechaInicio &&
            fechaHoy <= med.fechaFin
            ) {
            alert(`¡Es hora de tomar: ${med.nombre}!`);
            }
        });
        }, 30000);

        return () => clearInterval(intervalo);
    }, [medicaciones]);

    const editarMedicacion = async (medActualizada) => {
        if (!medActualizada || !medActualizada.id) return;
        try {
            const ref = doc(db, "medicaciones", medActualizada.id);
            await updateDoc(ref, medActualizada);
            await cargarMedicaciones();
            setShowEditModal(false);
            } catch (error) {
            console.error("Error al editar medicación:", error);
            }
        };      

    const eliminarMedicacion = async () => {
        if (!medicacionAEliminar) return;
        try {
        const ref = doc(db, "medicaciones", medicacionAEliminar.id);
        await deleteDoc(ref);
        await cargarMedicaciones();
        setShowDeleteModal(false);
        } catch (error) {
        console.error("Error al eliminar medicación:", error);
        }
    };

    const medicacionesFiltradas = medicaciones.filter((m) =>
        m.nombre?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Container style={{ marginTop: "100px" }}>
        <h4>💊 Alertas de Medicación</h4>

        <Button className="mb-3" onClick={() => setShowModal(true)}>
            Agregar medicación
        </Button>

        <Form.Control
            type="text"
            placeholder="Buscar por nombre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-3"
        />

        <TablaMedicaciones
            medicaciones={medicacionesFiltradas}
            openEditModal={(med) => {
            setMedicacionEditada(med);
            setShowEditModal(true);
            }}
            openDeleteModal={(med) => {
            setMedicacionAEliminar(med);
            setShowDeleteModal(true);
            }}
        />

        <ModalRegistroMedicacion
        show={showModal}
        onHide={() => setShowModal(false)}
        onMedicacionAgregada={(nuevaMed) => {
            setMedicaciones((prev) => [...prev, nuevaMed]);
            setShowModal(false);
        }}
        />


        <ModalEdicionMedicacion
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        datos={medicacionEditada}
        onGuardar={editarMedicacion}
        />


        <ModalEliminacionMedicacion
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            datos={medicacionAEliminar}
            onEliminar={eliminarMedicacion}
        />
        </Container>
    );
};

export default AlertasMedicacion;
