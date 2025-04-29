import React from "react";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ModalCompartirReporte = ({ show, onClose, medicaciones }) => {

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Medicaciones", 14, 16);

        const columnas = ["Nombre", "Hora", "Tomado", "Pospuesto", "Inicio", "Fin"];
        const filas = medicaciones.map((med) => [
        med.nombre,
        med.hora,
        med.tomado ? "Sí" : "No",
        med.pospuesto ? "Sí" : "No",
        med.fechaInicio,
        med.fechaFin,
        ]);

        autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 20,
        });

        return doc;
    };

    const guardarPDF = () => {
        const doc = generarPDF();
        doc.save("reporte_medicaciones.pdf");
        onClose();
    };

    const compartirPDF = async () => {
        const doc = generarPDF();
        const pdfBlob = doc.output("blob");

        if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], "reporte_medicaciones.pdf", { type: "application/pdf" })] })) {
        const file = new File([pdfBlob], "reporte_medicaciones.pdf", { type: "application/pdf" });

        try {
            await navigator.share({
            title: "Reporte de Medicaciones",
            text: "Te comparto mi reporte de medicaciones.",
            files: [file],
            });
        } catch (error) {
            console.error("Error al compartir:", error);
            alert("Error al intentar compartir.");
        }
        } else {
        alert("La función de compartir no está disponible en este navegador.");
        }

        onClose();
    };

    return (
        <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Compartir o Guardar Reporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>¿Qué deseas hacer con el reporte?</p>
            <div className="d-flex justify-content-around mt-3">
            <Button variant="primary" onClick={guardarPDF}>
                Guardar en dispositivo
            </Button>
            <Button variant="success" onClick={compartirPDF}>
                Compartir
            </Button>
            </div>
        </Modal.Body>
        </Modal>
    );
};

export default ModalCompartirReporte;
