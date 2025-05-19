import React from "react";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload, FaShareAlt } from "react-icons/fa";

const ModalCompartirReportePresion = ({ show, onClose, registros }) => {
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Presión Arterial", 14, 16);

        const columnas = ["Fecha", "Hora", "Sistólica", "Diastólica", "Rango"];
        const filas = registros.map((r) => [
        r.fecha,
        r.hora,
        r.sistolica,
        r.diastolica,
        r.rango || "N/A",
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
        doc.save("reporte_presion_arterial.pdf");
        onClose();
    };

    const compartirPDF = async () => {
        const doc = generarPDF();
        const pdfBlob = doc.output("blob");

        const file = new File([pdfBlob], "reporte_presion_arterial.pdf", { type: "application/pdf" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
            title: "Reporte de Presión Arterial",
            text: "Te comparto mi reporte de presión arterial.",
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
        <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Compartir o Guardar Reporte</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>¿Qué deseas hacer con el reporte de presión arterial?</p>
                <div className="d-flex justify-content-around mt-3">

                <div className="text-center">
                    <Button variant="outline-info" onClick={guardarPDF} className="d-flex flex-column align-items-center">
                    <FaDownload size={24} />
                    <div className="mt-1">Guardar</div>
                    </Button>
                </div>

                <div className="text-center">
                    <Button variant="outline-success" onClick={compartirPDF} className="d-flex flex-column align-items-center">
                    <FaShareAlt size={24} />
                    <div className="mt-1">Compartir</div>
                    </Button>
                </div>

                </div>

        </Modal.Body>
        </Modal>
    );
};

export default ModalCompartirReportePresion;
