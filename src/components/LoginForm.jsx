import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import logo from "../assets/logo.png";
import "../styles/Login.css";

const LoginForm = ({ email, password, error, setEmail, setPassword, handleSubmit }) => {
  return (
  <section className="background-radial-gradient overflow-hidden">      
    <Container className="px-4 py-5 text-center text-lg-start my-5">
        <Row className="gx-lg-5 align-items-center mb-5">
          <Col lg={6} className="mb-5 mb-lg-0" style={{ zIndex: 10 }}>
        <img src={logo} alt="Cardiovita" width={60} className="mb-4 logo-animated" />
            <h1 className="my-4 display-5 fw-bold ls-tight text-white">
              Bienvenido de nuevo <br />
              <span style={{ color: "hsl(218, 81%, 75%)" }}>
                Inicia sesión para continuar
              </span>
            </h1>
            <p className="mb-4 text-light opacity-75">
              Accede a tus datos de salud, monitorea tu presión arterial y mantente al día con tus alertas médicas.
            </p>
          </Col>

          <Col lg={6} className="position-relative">
            <Card className="bg-glass">
              <Card.Body className="px-4 py-5">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formEmail">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {error && <p className="text-danger mb-3">{error}</p>}

                  <Button type="submit" variant="primary" className="w-100 mb-3">
                    Iniciar Sesión
                  </Button>

                  <Button as="a" href="/registro" variant="outline-secondary" className="w-100">
                    Registrar Usuario
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default LoginForm;