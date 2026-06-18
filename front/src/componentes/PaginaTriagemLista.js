import { useEffect, useState } from "react";
import { get, del } from "../servicos/api";

function PaginaTriagemLista() {
    const [triagens, setTriagens] = useState([]);

    useEffect(() => {
        carregarTriagens();
    }, []);

    async function carregarTriagens() {
    try {
        const resposta = await get("/triagens/view");

        if (Array.isArray(resposta)) {
            setTriagens(resposta);
        } else if (Array.isArray(resposta.data)) {
            setTriagens(resposta.data);
        } else {
            setTriagens([]);
        }
    } catch (error) {
        console.error("Erro ao carregar triagens:", error);

        const mensagemErro =
            error.response?.data?.mensagem ||
            error.response?.data?.erro ||
            error.response?.data?.message ||
            error.response?.data ||
            error.message;

        alert("Erro ao carregar triagens: " + mensagemErro);
        setTriagens([]);
    }
}

    async function excluir(id_triagem) {
        try {
            const confirmar = window.confirm(
                "Deseja realmente excluir esta triagem?"
            );

            if (!confirmar) {
                return;
            }

            await del("/triagens/" + id_triagem);

            alert("Triagem excluída com sucesso!");
            carregarTriagens();
        } catch (error) {
            console.error("Erro ao excluir triagem:", error);

            const mensagemErro =
                error.response?.data?.mensagem ||
                error.response?.data?.erro ||
                error.response?.data?.message ||
                error.response?.data ||
                error.message;

            alert("Erro ao excluir triagem: " + mensagemErro);
        }
    }

    function formatarData(data) {
        if (!data) {
            return "";
        }

        return new Date(data).toLocaleString("pt-BR");
    }

    return (
        <div className="container mt-4">
            <div className="mb-3">
              <h2>Triagens Registradas</h2>
            </div>

            <div className="card">
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Consulta G4</th>
                                <th>Paciente</th>
                                <th>Sintomas</th>
                                <th>Temperatura</th>
                                <th>Freq. Cardíaca</th>
                                <th>Classificação</th>
                                <th>Status</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {triagens.length === 0 && (
                                <tr>
                                    <td colSpan="11" className="text-center">
                                        Nenhuma triagem cadastrada.
                                    </td>
                                </tr>
                            )}

                            {Array.isArray(triagens) && triagens.map((triagem) => (
                                <tr key={triagem.id_triagem}>
                                    <td>{triagem.id_triagem}</td>
                                    <td>{triagem.id_consulta_externa}</td>
                                    <td>{triagem.nome_paciente}</td>
                                    <td>{triagem.sintomas_relatados}</td>
                                    <td>{triagem.temperatura}</td>
                                    <td>{triagem.frequencia_cardiaca}</td>
                                    <td>{triagem.classificacao_risco}</td>
                                    <td>{triagem.status_triagem}</td>
                                    <td>{formatarData(triagem.data_triagem)}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => excluir(triagem.id_triagem)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PaginaTriagemLista;