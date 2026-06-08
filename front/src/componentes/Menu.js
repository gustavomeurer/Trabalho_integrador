function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">
          <i className="bi bi-car-front-fill me-2" />
          AlugueCar
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" href="/">
                Início/Catálogo
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/veiculos">
                Veículos
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/veiculo">
                Novo Veículo
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/clientes">
                Clientes
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/cliente">
                Novo Cliente
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/categorias">
                Categorias
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/categoria">
                Nova Categoria
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/alugueis">
                Aluguéis
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/aluguel">
                Novo Aluguel
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;