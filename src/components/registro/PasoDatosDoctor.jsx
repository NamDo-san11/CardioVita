import { Form } from "react-bootstrap";

const PasoDatosDoctor = ({ datos, handleChange }) => {
    return (
        <>
        <Form.Group className="mb-3">
            <Form.Label>Especialidad médica</Form.Label>
            <Form.Control
            type="text"
            name="especialidad"
            value={datos.especialidad || ""}
            onChange={handleChange}
            placeholder="Ej. Cardiología"
            required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Número de colegiación</Form.Label>
            <Form.Control
            type="text"
            name="colegiacion"
            value={datos.colegiacion || ""}
            onChange={handleChange}
            placeholder="Ej. 123456"
            required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
            type="text"
            name="cedula"
            value={datos.cedula || ""}
            onChange={handleChange}
            placeholder="Ej. 001-090789-1234Z"
            required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Experiencia (años)</Form.Label>
            <Form.Control
            type="number"
            name="experiencia"
            value={datos.experiencia || ""}
            onChange={handleChange}
            min="0"
            placeholder="Ej. 5"
            required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Hospital o Clínica</Form.Label>
            <Form.Control
            type="text"
            name="centroTrabajo"
            value={datos.centroTrabajo || ""}
            onChange={handleChange}
            placeholder="Ej. Clínica Familiar Juigalpa"
            required
            />
        </Form.Group>
        </>
    );
};

export default PasoDatosDoctor;
