import { Link } from "react-router-dom";

function PaginaInicio() {
    return (
        <div className="container mt-5">
            <div className="p-5 bg-light rounded shadow-sm">
                <h1 className="text-danger fw-bold">
                    Sistema de Triagem Hospitalar
                </h1>

                <p className="lead">
                    Sistema responsável por registrar triagens de pacientes a partir de consultas pré-agendadas
                    recebidas via integração com o grupo G4.
                </p>

                <p>
                    A triagem registra sintomas, temperatura, frequência cardíaca e gravidade dos sintomas.
                    Com essas informações, o sistema define automaticamente a classificação de risco e a prioridade
                    de atendimento.
                </p>

                <div className="mt-4">
                    <Link className="btn btn-danger me-2" to="/triagem">
                        Registrar Triagem
                    </Link>

                    <Link className="btn btn-outline-danger me-2" to="/triagens">
                        Ver Triagens
                    </Link>

                    <Link className="btn btn-outline-danger" to="/consultas-integracao">
                        Ver Consultas G4
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PaginaInicio;