import React from "react";
import { Modal, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload, FaShareAlt } from "react-icons/fa";

const ModalReportePacientes = ({ show, onClose, pacientes }) => {
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Pacientes", 14, 16);

    const columnas = ["Nombre", "Correo", "Edad", "IMC", "Herencia"];
    const filas = pacientes.map((p) => [
      p.nombre,
      p.correo,
      p.edad,
      p.imc,
      p.herencia,
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
    doc.save("reporte_pacientes.pdf");
    onClose();
  };

  const compartirPDF = async () => {
    const doc = generarPDF();
    const pdfBlob = doc.output("blob");

    const file = new File([pdfBlob], "reporte_pacientes.pdf", { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Reporte de Pacientes",
          text: "Te comparto el reporte de pacientes con indicadores de salud.",
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
        <Modal.Title>Exportar o Compartir Reporte</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Qué deseas hacer con el reporte de pacientes?</p>
        <div className="d-flex justify-content-around mt-4">
          <div className="text-center">
            <Button variant="primary" onClick={guardarPDF}>
              <FaDownload size={24} /> <div className="mt-1">Guardar</div>
            </Button>
          </div>
          <div className="text-center">
            <Button variant="success" onClick={compartirPDF}>
              <FaShareAlt size={24} /> <div className="mt-1">Compartir</div>
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalReportePacientes;
