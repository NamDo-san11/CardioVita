import { useEffect, useState } from "react";
import { db, auth } from "../../database/firebaseconfig";
import { Button } from "react-bootstrap";
import { PencilSquare, Trash, } from "react-bootstrap-icons";
import { FaShareAlt } from 'react-icons/fa';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import ModalCompartirReporteSintomas from "../reporte/ModalCompartirReporteSintomas"; // Importamos el modal

const HistorialSintomas = ({ onEdit }) => {
    const [historial, setHistorial] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchHistorial = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            const querySnapshot = await getDocs(collection(db, "cuestionario_sintomas"));
            const datos = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((doc) => doc.uid === currentUser.uid);
            setHistorial(datos);
        };
        fetchHistorial();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
            await deleteDoc(doc(db, "cuestionario_sintomas", id));
            setHistorial(historial.filter((item) => item.id !== id));
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Historial de Síntomas</h2>
                <Button variant="info" onClick={handleOpenModal}>
                    <FaShareAlt /> Compartir Reporte
                </Button>

            </div>

            <div className="row">
                {historial.length === 0 ? (
                    <p>No hay registros disponibles.</p>
                ) : (
                    historial.map((item) => (
                        <div key={item.id} className="col-md-4 mb-4 d-flex">
                            <div className="card w-100 tarjeta-sintoma">
                                <div className="card-body d-flex flex-column">
                                    <div className="contenido-superior mb-3">
                                        <h5 className="card-title">Fecha: {item.fecha}</h5>
                                        <p><strong>Estado de Ánimo:</strong> {item.estadoAnimo.join(", ")}</p>
                                        <p><strong>Síntomas:</strong> {item.sintomas.join(", ")}</p>
                                        <p><strong>Actividad Física:</strong> {item.actividadFisica.join(", ")}</p>
                                        {item.otraAnomalia && (
                                            <p><strong>Otra Anomalía:</strong> {item.otraAnomalia}</p>
                                        )}
                                    </div>
                                    <div className="mt-auto text-end">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => onEdit(item)}
                                        >
                                            <PencilSquare size={16} />
                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <Trash size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Compartir Reporte */}
            <ModalCompartirReporteSintomas
                show={showModal}
                onClose={handleCloseModal}
                historial={historial}
            />
        </div>
    );
};

export default HistorialSintomas;
