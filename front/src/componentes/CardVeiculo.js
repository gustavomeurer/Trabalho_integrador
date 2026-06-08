function CardVeiculo({ imagem, titulo, categoria, descricao }) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0">
        <img
          src={imagem}
          className="card-img-top p-3"
          alt={titulo}
          style={{
            height: "360px",
            objectFit: "contain"
          }}
        />

        <div className="card-body">
          <span className="badge bg-primary mb-2">{categoria}</span>

          <h5 className="card-title h6 text-truncate">{titulo}</h5>

          <p className="card-text small text-muted">
            {descricao}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardVeiculo;