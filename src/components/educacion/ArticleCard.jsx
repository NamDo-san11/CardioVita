import React from "react";
import { Card, Button, Badge } from "react-bootstrap";

const ArticleCard = ({ articulo, toggleLeido, toggleFavorito }) => {
  return (
    <Card onClick={() => console.log("Ver artículo completo")} style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
      <Card.Img
        variant="top"
        src={articulo.imagen}
        alt={articulo.titulo}
        style={{ height: "180px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column justify-content-between flex-grow-1">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title className="h6 mb-0">{articulo.titulo}</Card.Title>
            {articulo.favorito && <Badge bg="warning" text="dark">⭐</Badge>}
          </div>

          <Card.Text className="text-muted" style={{ fontSize: "0.9rem" }}>
            {articulo.descripcion.length > 100
              ? articulo.descripcion.substring(0, 100) + "..."
              : articulo.descripcion}
          </Card.Text>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant={articulo.leido ? "success" : "outline-success"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleLeido(articulo.id);
            }}
            className="w-50 me-1"
          >
            {articulo.leido ? "Leído" : "Marcar Leído"}
          </Button>

          <Button
            variant={articulo.favorito ? "warning" : "outline-warning"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorito(articulo.id);
            }}
            className="w-50 ms-1"
          >
            {articulo.favorito ? "Quitar Favorito" : "Favorito"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArticleCard;
