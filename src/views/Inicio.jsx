import { useNavigate } from "react-router-dom";
import { Button,Container, } from "react-bootstrap";
const Inicio = () => {

    const navigate = useNavigate();

    // Función de navegación
    const handleNavigate = (path) => {
        navigate(path);


    };
    return (
        <Container>
        <br />
        <br />
        <br />
        <h1>Inicio</h1>
        <Button  onClick={() => handleNavigate("/Sintomas")} >TABLA SINTOMAS</Button>
        </Container>
    )
}

export default Inicio;  