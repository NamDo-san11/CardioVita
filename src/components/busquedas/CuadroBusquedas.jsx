import React from "react";
import { Form, InputGroup } from "react-bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css";

const CuadroBusquedas = ({searhText, handleSearchChange}) => {
    return (
        <InputGroup className="mb-3" style={{ width: "400px"}}>
            <InputGroup.Text>
                <i className="bi bi-search"></i>
            </InputGroup.Text>

            <Form.Control
                typo="text"
                placeholder="Buscar ..."
                value={searhText}
                onChange={handleSearchChange}
            >
            </Form.Control>
        </InputGroup>
    );
}

export default CuadroBusquedas;