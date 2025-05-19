import React from "react";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload, FaShareAlt } from "react-icons/fa";

const ModalCompartirReporteSintomas = ({ show, onClose, historial }) => {

    const limpiarTexto = (texto) => {
        return texto
          // Reemplaza emojis comunes por texto
            .replace(/😊/g, "Feliz")
            .replace(/😔/g, "Deprimido")
            .replace(/😌/g, "Tranquilo")
            .replace(/🥳/g, "Emocionado")
            .replace(/😵/g, "Dolor de cabeza")
            .replace(/🤧/g, "Sangrado nasal")
            .replace(/🥴/g, "Fatiga")
            .replace(/😷/g, "Mareos")
            .replace(/🧘‍♀️/g, "Ejercicio")
            .replace(/🚶‍♂️/g, "No hizo ejercicio")
            .replace(/🏋️‍♂️/g, "Trabajo")
            .replace(/🛌/g, "Reposo")
        
            // Elimina cualquier carácter que no esté en el rango ASCII imprimible
            .split("")
            .filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126)
            .join("");
        };      
        
        const generarPDF = () => {
            const doc = new jsPDF();
            doc.text("Reporte de Historial de Síntomas", 14, 16);
        
            const columnas = ["Fecha", "Estado Ánimo", "Síntomas", "Actividad Física", "Otra Anomalía"];
            const filas = historial.map((item) => [
            item.fecha,
            limpiarTexto(item.estadoAnimo.join(", ")),
            limpiarTexto(item.sintomas.join(", ")),
            limpiarTexto(item.actividadFisica.join(", ")),
            limpiarTexto(item.otraAnomalia || "N/A"),
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
        doc.save("reporte_historial_sintomas.pdf");
        onClose();
    };

    const compartirPDF = async () => {
        const doc = generarPDF();
        const pdfBlob = doc.output("blob");

        if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], "reporte_historial_sintomas.pdf", { type: "application/pdf" })] })) {
        const file = new File([pdfBlob], "reporte_historial_sintomas.pdf", { type: "application/pdf" });

        try {
            await navigator.share({
            title: "Reporte de Síntomas",
            text: "Te comparto mi historial de síntomas.",
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
            <p>¿Qué deseas hacer con el reporte historial de síntomas?</p>
            <div className="d-flex justify-content-around mt-3">

            <div className="text-center">
                <Button variant="primary" onClick={guardarPDF} className="d-flex flex-column align-items-center">
                <FaDownload size={24} />
                <div className="mt-1">Guardar</div>
                </Button>
            </div>

            <div className="text-center">
                <Button variant="success" onClick={compartirPDF} className="d-flex flex-column align-items-center">
                <FaShareAlt size={24} />
                <div className="mt-1">Compartir</div>
                </Button>
            </div>

            </div>

        </Modal.Body>
        </Modal>
    );
};

export default ModalCompartirReporteSintomas;
