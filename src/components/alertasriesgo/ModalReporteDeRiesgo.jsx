import React from "react";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload, FaShareAlt } from "react-icons/fa";

const ModalReporteDeRiesgo = ({ show, onClose, pacientes }) => {
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Pacientes con Riesgo", 14, 16);

        const columnas = [
            "Nombre",
            "Correo",
            "Edad",
            "Sistólica Prom.",
            "Diastólica Prom.",
            "Frecuencia"
        ];

        const filas = pacientes.map((p) => [
            p?.nombre || "Desconocido",
            p?.correo || "No disponible",
            p?.edad ?? "N/A",
            p?.sistolicaProm ?? "N/A",
            p?.diastolicaProm ?? "N/A",
            p?.frecuencia ?? "N/A"
        ]);

        autoTable(doc, {
            head: [columnas],
            body: filas,
            startY: 20,
        });

        return doc;
    };

    const guardarPDF = () => {
        try {
            const doc = generarPDF();
            doc.save("reporte_pacientes_riesgo.pdf");
        } catch (error) {
            console.error("Error al generar PDF:", error);
            alert("❌ Hubo un error al guardar el PDF.");
        }
        onClose();
    };

    const compartirPDF = async () => {
        try {
            const doc = generarPDF();
            const pdfBlob = doc.output("blob");

            const file = new File([pdfBlob], "reporte_pacientes_riesgo.pdf", {
                type: "application/pdf"
            });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: "Reporte de Pacientes en Riesgo",
                    text: "Te comparto el reporte de pacientes con presión alterada.",
                    files: [file],
                });
            } else {
                alert("⚠️ La función de compartir no está disponible en este navegador.");
            }
        } catch (error) {
            console.error("Error al compartir:", error);
            alert("❌ Error al intentar compartir.");
        }

        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Exportar o Compartir Reporte</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Qué deseas hacer con el reporte de pacientes?</p>
                <div className="d-flex justify-content-around mt-4">
                    <div className="text-center">
                        <Button variant="primary" onClick={guardarPDF}>
                            <FaDownload size={24} />
                            <div className="mt-1">Guardar</div>
                        </Button>
                    </div>
                    <div className="text-center">
                        <Button variant="success" onClick={compartirPDF}>
                            <FaShareAlt size={24} />
                            <div className="mt-1">Compartir</div>
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalReporteDeRiesgo;
