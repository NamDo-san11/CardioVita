import React, { useEffect, useState } from "react";
import { db } from "../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { Spinner, Button } from "react-bootstrap";
import AlertaDeRiesgoTable from "../components/alertasriesgo/AlertaDeRiestoTable";
import ModalReporteDeRiesgo from "../components/alertasriesgo/ModalReporteDeRiesgo";
import ModalNotificacion from "../components/alertasriesgo/ModalNotificacion";

const AlertasDeRiesgo = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [pacientesEnRiesgo, setPacientesEnRiesgo] = useState([]);
    const [showNotificacion, setShowNotificacion] = useState(false);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
                const presionSnapshot = await getDocs(collection(db, "presion_arterial"));

                const presionesPorUid = {};
                presionSnapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    if (!presionesPorUid[data.uid]) presionesPorUid[data.uid] = [];
                    presionesPorUid[data.uid].push(data);
                });

                const usuariosData = usuariosSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((user) => user.rol === "usuario")
                    .map((user) => {
                        const registros = presionesPorUid[user.uid] || [];

                        const sistolicaProm = registros.length
                            ? `${Math.round(registros.reduce((sum, r) => sum + Number(r.sistolica), 0) / registros.length)} mmHg`
                            : "N/D";

                        const diastolicaProm = registros.length
                            ? `${Math.round(registros.reduce((sum, r) => sum + Number(r.diastolica), 0) / registros.length)} mmHg`
                            : "N/D";

                        const frecuencia = registros.length
                            ? calcularFrecuenciaHabitual(registros.map((r) => r.rango))
                            : "N/D";

                        return {
                            nombre: user.nombre || "Desconocido",
                            correo: user.correo || "Sin correo",
                            edad: user.edad || "N/D",
                            sistolicaProm,
                            diastolicaProm,
                            frecuencia,
                        };
                    });

                setPacientes(usuariosData);

                // 👉 Buscar pacientes en riesgo
                const pacientesRiesgo = usuariosData.filter(p => p.frecuencia.startsWith("Alta"));
                setPacientesEnRiesgo(pacientesRiesgo);

                // 👉 Mostrar notificación si hay pacientes en riesgo
                if (pacientesRiesgo.length > 0) {
                    setShowNotificacion(true);
                }

            } catch (error) {
                console.error("Error al obtener los datos:", error);
            } finally {
                setLoading(false);
            }
        };

        obtenerDatos();
    }, []);

    const calcularFrecuenciaHabitual = (rangos) => {
        const contador = {};
        rangos.forEach((r) => {
            contador[r] = (contador[r] || 0) + 1;
        });

        const total = rangos.length;
        const ordenados = Object.entries(contador).sort((a, b) => b[1] - a[1]);

        if (!ordenados.length) return "N/D";

        const [rango, cantidad] = ordenados[0];
        const porcentaje = Math.round((cantidad / total) * 100);

        return `${rango} (${porcentaje}%)`;
    };

    return (
        <div className="container mt-4">
            <h2 className="text-black mb-4">Lista de Pacientes en Probabilidad de Riesgo</h2>

            {loading ? (
                <Spinner animation="border" variant="light" />
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Button variant="outline-info" onClick={() => setShowModal(true)}>
                            Generar Reporte PDF
                        </Button>
                    </div>

                    <AlertaDeRiesgoTable pacientes={pacientes} filtro={filtro} setFiltro={setFiltro} />
                </>
            )}

            <ModalReporteDeRiesgo
                show={showModal}
                onClose={() => setShowModal(false)}
                pacientes={pacientes}
            />

            {/* 🚨 Notificación de alerta */}
            <ModalNotificacion
                show={showNotificacion}
                onClose={() => setShowNotificacion(false)}
                pacientesEnRiesgo={pacientesEnRiesgo}
            />
        </div>
    );
};

export default AlertasDeRiesgo;
