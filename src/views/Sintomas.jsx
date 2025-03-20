import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    } from "firebase/firestore";

import TablaSintomas from "../components/sintomas/TablaSintomas";
import ModalRegistroSintoma from "../components/sintomas/ModalRegistroSintoma";
import ModalEdicionSintoma from "../components/sintomas/ModalEdicionSintomas";
import ModalEliminacionSintoma from "../components/sintomas/ModalEliminacionSintomas";

    const Sintomas = () => {
    const [sintomas, setSintomas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nuevoSintoma, setNuevoSintoma] = useState({ nombre: "", descripcion: "" });
    const [sintomaEditado, setSintomaEditado] = useState(null);
    const [sintomaAEliminar, setSintomaAEliminar] = useState(null);

    const sintomasCollection = collection(db, "sintomas");

    const fetchSintomas = async () => {
        try {
        const data = await getDocs(sintomasCollection);
        const lista = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setSintomas(lista);
        } catch (error) {
        console.error("Error al obtener los síntomas:", error);
        }
    };

    useEffect(() => {
        fetchSintomas();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoSintoma((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setSintomaEditado((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSintoma = async () => {
        if (!nuevoSintoma.nombre || !nuevoSintoma.descripcion) {
        alert("Completa todos los campos");
        return;
        }
        try {
        await addDoc(sintomasCollection, nuevoSintoma);
        setShowModal(false);
        setNuevoSintoma({ nombre: "", descripcion: "" });
        await fetchSintomas();
        } catch (error) {
        console.error("Error al agregar síntoma:", error);
        }
    };

    const handleEditSintoma = async () => {
        if (!sintomaEditado.nombre || !sintomaEditado.descripcion) {
        alert("Completa todos los campos");
        return;
        }
        try {
        const ref = doc(db, "sintomas", sintomaEditado.id);
        await updateDoc(ref, sintomaEditado);
        setShowEditModal(false);
        await fetchSintomas();
        } catch (error) {
        console.error("Error al editar síntoma:", error);
        }
    };

    const handleDeleteSintoma = async () => {
        try {
        const ref = doc(db, "sintomas", sintomaAEliminar.id);
        await deleteDoc(ref);
        setShowDeleteModal(false);
        await fetchSintomas();
        } catch (error) {
        console.error("Error al eliminar síntoma:", error);
        }
    };

    const openEditModal = (sintoma) => {
        setSintomaEditado({ ...sintoma });
        setShowEditModal(true);
    };

    const openDeleteModal = (sintoma) => {
        setSintomaAEliminar(sintoma);
        setShowDeleteModal(true);
    };

    return (
        <Container className="mt-5">
        <br />
        <h4>Gestión de Síntomas</h4>
        <Button className="mb-3" onClick={() => setShowModal(true)}>Agregar Síntoma</Button>
        <TablaSintomas
            sintomas={sintomas}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
        />
        <ModalRegistroSintoma
            showModal={showModal}
            setShowModal={setShowModal}
            nuevoSintoma={nuevoSintoma}
            handleInputChange={handleInputChange}
            handleAddSintoma={handleAddSintoma}
        />
        <ModalEdicionSintoma
            showEditModal={showEditModal}
            setShowEditModal={setShowEditModal}
            sintomaEditado={sintomaEditado}
            handleEditInputChange={handleEditInputChange}
            handleEditSintoma={handleEditSintoma}
        />
        <ModalEliminacionSintoma
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handleDeleteSintoma={handleDeleteSintoma}
        />
        </Container>
    );
};

export default Sintomas;
