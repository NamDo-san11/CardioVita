import { Form, Button } from "react-bootstrap";
import PasoDatosUsuario from "./PasoDatosUsuario";
import PasoDatosDoctor from "./PasoDatosDoctor";

const Paso2 = ({ datos, onChange, onGuardar, onBack, cargando }) => {
    const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value); 
    };

    return (
    <Form>
        {datos.rol.toLowerCase() === "usuario" ? (
        <PasoDatosUsuario datos={datos} handleChange={handleChange} />
        ) : (
        <PasoDatosDoctor datos={datos} handleChange={handleChange} />
        )}
        <div className="d-flex justify-content-between mt-3">
        <Button variant="secondary" onClick={onBack}>Volver</Button>
        <Button variant="success" onClick={onGuardar} disabled={cargando}>
            {cargando ? (
                <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
                </>
            ) : (
                "Crear Cuenta"
            )}
        </Button>

        </div>
    </Form>
    );
};  

export default Paso2;
