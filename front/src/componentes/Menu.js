import { Link } from "react-router-dom";

function Menu() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    Sistema de Triagem
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menuPrincipal"
                    aria-controls="menuPrincipal"
                    aria-expanded="false"
                    aria-label="Alternar navegação"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menuPrincipal">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Início
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/consultas-integracao">
                                Consultas G4
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/triagens">
                                Triagens
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/triagem">
                                Nova Triagem
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/classificacoes-risco">
                                Classificações
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/logs-triagem">
                                Logs
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Menu;