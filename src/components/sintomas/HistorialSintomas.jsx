import { useEffect, useState } from "react";
import { db, auth } from "../../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const HistorialSintomas = ({ onEdit }) => {
    const [historial, setHistorial] = useState([]);

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

    return (
        <div className="container mt-4">
            <h2>Historial de Síntomas</h2>
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
                              {item.otraAnomalia && <p><strong>Otra Anomalía:</strong> {item.otraAnomalia}</p>}
                            </div>
                            <div className="mt-auto text-end">
                              <button className="btn btn-warning me-2" onClick={() => onEdit(item)}>
                                Editar
                              </button>
                              <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    ))
                )}
            </div>
        </div>
    );
};

export default HistorialSintomas;
