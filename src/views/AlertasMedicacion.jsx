import React, { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, doc, updateDoc, deleteDoc, onSnapshot, query, where, } from "firebase/firestore";
import ReactGA from "react-ga4";
import { useAuth } from "../database/authcontext";
import { Row, Col } from "react-bootstrap";
import { FaPills, FaPlus } from "react-icons/fa";

    import TablaMedicaciones from "../components/medicaciones/TablaMedicaciones";
    import ModalRegistroMedicacion from "../components/medicaciones/ModalRegistroMedicacion";
    import ModalEdicionMedicacion from "../components/medicaciones/ModalEdicionMedicacion";
    import ModalEliminacionMedicacion from "../components/medicaciones/ModalEliminacionMedicacion";
    import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
    import Paginacion from "../components/ordenamiento/Paginacion";
    import AlertasAutomaticas from "../components/medicaciones/AlertasAutomaticas";

    const AlertasMedicacion = () => {
    const { user } = useAuth();
    const uid = user?.uid;

    const [medicaciones, setMedicaciones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [medicacionEditada, setMedicacionEditada] = useState(null);
    const [medicacionAEliminar, setMedicacionAEliminar] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        // ?Iniciar Analityc la app
        ReactGA.initialize("G-ZPQ0YG91K6");
    
        ReactGA.send({
        hitType: 'pageview',
        page: window.location.pathname,
        title: 'AlertasMedicacion.jsx'
        })
    }, []);

    useEffect(() => {
        if (!uid) return;

        const q = query(collection(db, "medicaciones"), where("uid", "==", uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMedicaciones(docs);
        });

        return () => unsubscribe();
    }, [uid]);

    const handleSearchChange = (e) => {
        const text = e.target.value.toLowerCase();
        setSearchText(text);
        setCurrentPage(1);
    };

    const medicacionesFiltradas = medicaciones.filter((med) => {
        return (
        (med.nombre && med.nombre.toLowerCase().includes(searchText)) ||
        (med.descripcion && med.descripcion.toLowerCase().includes(searchText))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const medicacionesPaginadas = medicacionesFiltradas.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const editarMedicacion = async (medActualizada) => {
        if (!medActualizada || !medActualizada.id) return;
        try {
        const ref = doc(db, "medicaciones", medActualizada.id);
        await updateDoc(ref, medActualizada);
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
        setShowDeleteModal(false);
        } catch (error) {
        console.error("Error al eliminar medicación:", error);
        }
    };

    return (
            <Container style={{ marginTop: "100px" }}>
            <h4>💊 Alertas de Medicación</h4>
        
            <Row className="align-items-center mb-3">
                <Col xs={12} md={4} className="mb-2">
                <Button
                onClick={() => setShowModal(true)}
                style={{ width: "100%" }}
                title="Agregar medicación"
                >
                <FaPills className="me-1" />
                <FaPlus />
                </Button>

                </Col>
                <Col xs={12} md={8}>
                <CuadroBusquedas
                    searchText={searchText}
                    handleSearchChange={handleSearchChange}
                    style={{ width: "100%" }}
                />
                </Col>

            </Row>

            <TablaMedicaciones
            medicaciones={medicacionesPaginadas}
            openEditModal={(med) => {
                setMedicacionEditada(med);
                setShowEditModal(true);
            }}
            openDeleteModal={(med) => {
                setMedicacionAEliminar(med);
                setShowDeleteModal(true);
            }}
            />

        
            <Paginacion
                itemsPerPage={itemsPerPage}
                totalItems={medicacionesFiltradas.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        
            <ModalRegistroMedicacion
                show={showModal}
                onHide={() => setShowModal(false)}
                onMedicacionAgregada={() => setShowModal(false)}
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
        
            <AlertasAutomaticas medicaciones={medicaciones} />
            </Container>
        );      
};

export default AlertasMedicacion;