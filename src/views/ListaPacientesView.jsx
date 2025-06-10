import React, { useEffect, useState } from "react";
import { db } from "../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { Spinner } from "react-bootstrap";
import PacienteTable from "../components/pacientes/PacienteTable";
import ModalReportePacientes from "../components/reporte/ModalReportePacientes";
import { Button } from "react-bootstrap";
import GraficoEdadPacientes from "../components/graficos/GraficoEdadPacientes";



const ListaPacientesView = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    const obtenerPacientes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "usuarios"));
        const data = snapshot.docs
          .map((doc) => doc.data())
          .filter((user) => user.rol === "usuario")
          .map((user) => {
            const peso = parseFloat(user.peso || 0);
            const estatura = parseFloat(user.estatura || 1);
            const imc = estatura > 0 ? (peso / (estatura * estatura)).toFixed(1) : "N/A";
            return {
              nombre: user.nombre || "Desconocido",
              correo: user.correo || "Sin correo",
              edad: user.edad || "N/D",
              imc,
              herencia: user.herencia === "si" ? "Sí" : "No",
            };
          });
        setPacientes(data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerPacientes();
  }, []);



return (
  <div className="container mt-4">
    <h2 className="text-black mb-4">Lista de Pacientes</h2>

    {loading ? (
      <Spinner animation="border" variant="light" />
    ) : (
      <>
        <GraficoEdadPacientes pacientes={pacientes} />
        
      
        <PacienteTable pacientes={pacientes} filtro={filtro} setFiltro={setFiltro} />
        <div className="d-flex justify-content-between align-items-center mb-3">

          <Button variant="outline-info" onClick={() => setShowModal(true)}>
            Generar Reporte PDF
          </Button>
        </div>
     

        
      </>
    )}

    <ModalReportePacientes
      show={showModal}
      onClose={() => setShowModal(false)}
      pacientes={pacientes}
    />
  </div>
);
};

export default ListaPacientesView;
