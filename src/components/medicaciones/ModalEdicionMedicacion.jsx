import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getAuth } from "firebase/auth";

const ModalEdicionMedicacion = ({ show, onHide, datos, onGuardar }) => {
    const auth = getAuth();
    const uid = auth.currentUser?.uid;

    const [formData, setFormData] = useState({
        nombre: "",
        hora: "08:00 AM",
        tomado: false,
        pospuesto: false,
        fechaInicio: "",
        fechaFin: "",
        uid: uid || "",
    });

    const [errores, setErrores] = useState({});

    // Extraer partes de la hora actual para mostrar en los inputs
    const [hora12, setHora12] = useState("08");
    const [min, setMin] = useState("00");
    const [periodo, setPeriodo] = useState("AM");

    useEffect(() => {
        if (datos) {
            setFormData({
                ...datos,
                uid: uid || datos.uid || "",
            });

            const [hStr, minStr] = (datos.hora || "08:00 AM").split(":");
            const [m, ampm] = minStr.split(" ");
            setHora12(hStr.padStart(2, "0"));
            setMin(m.padStart(2, "0"));
            setPeriodo(ampm);
        }
    }, [datos, uid]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleHoraChange = (h, m, p) => {
        setHora12(h);
        setMin(m);
        setPeriodo(p);
        const nuevaHora = `${h}:${m} ${p}`;
        setFormData((prev) => ({
            ...prev,
            hora: nuevaHora,
        }));
    };

    const handleSubmit = () => {
        const nuevosErrores = {};
    
        if (!hora12 || !min || !periodo) {
            nuevosErrores.hora = "La hora de toma es obligatoria.";
        }
    
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }
    
        // Usar formato 12h directamente
        const horaFinal = `${hora12}:${min} ${periodo}`;
    
        setErrores({}); // limpiar errores
        onGuardar({ ...formData, hora: horaFinal });
    };
    

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Medicación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hora de Toma</Form.Label>
                        <div className="d-flex gap-2 align-items-center">
                            <Form.Control
                                type="number"
                                min="1"
                                max="12"
                                value={hora12}
                                onChange={(e) => {
                                    let h = parseInt(e.target.value);
                                    if (isNaN(h) || h < 1) h = 1;
                                    if (h > 12) h = 12;
                                    h = String(h).padStart(2, "0");
                                    handleHoraChange(h, min, periodo);
                                }}
                                placeholder="HH"
                                isInvalid={!!errores.hora}
                                style={{ width: "80px" }}
                            />
                            :
                            <Form.Control
                                type="number"
                                min="0"
                                max="59"
                                value={min}
                                onChange={(e) => {
                                    let m = parseInt(e.target.value);
                                    if (isNaN(m) || m < 0) m = 0;
                                    if (m > 59) m = 59;
                                    m = String(m).padStart(2, "0");
                                    handleHoraChange(hora12, m, periodo);
                                }}
                                placeholder="MM"
                                isInvalid={!!errores.hora}
                                style={{ width: "80px" }}
                            />
                            <Form.Select
                                value={periodo}
                                onChange={(e) => {
                                    handleHoraChange(hora12, min, e.target.value);
                                }}
                                style={{ width: "90px" }}
                            >
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </Form.Select>
                        </div>
                        <Form.Control.Feedback type="invalid">
                            {errores.hora}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Inicio</Form.Label>
                        <Form.Control
                            type="date"
                            name="fechaInicio"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Fin</Form.Label>
                        <Form.Control
                            type="date"
                            name="fechaFin"
                            value={formData.fechaFin}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTomado">
                        <Form.Check
                            type="checkbox"
                            name="tomado"
                            checked={formData.tomado}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData((prev) => ({
                                    ...prev,
                                    tomado: checked,
                                    pospuesto: checked ? false : prev.pospuesto,
                                }));
                            }}
                            label="Tomado"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPospuesto">
                        <Form.Check
                            type="checkbox"
                            name="pospuesto"
                            checked={formData.pospuesto}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData((prev) => ({
                                    ...prev,
                                    pospuesto: checked,
                                    tomado: checked ? false : prev.tomado,
                                }));
                            }}
                            label="Pospuesto"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEdicionMedicacion;
