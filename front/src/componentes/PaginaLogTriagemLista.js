import { get } from "../servicos/api";
import { useEffect, useState } from "react";

function PaginaLogTriagemLista() {
  const [dados, setDados] = useState([]);

  const listar = async () => {
    try {
      const resposta = await get("logs-triagem");
      setDados(resposta);
    } catch (error) {
      alert("Erro ao listar logs de triagem: " + error);
    }
  };

  const formatarData = (data) => {
    if (!data) {
      return "";
    }

    return new Date(data).toLocaleString("pt-BR");
  };

  useEffect(() => {
    listar();
  }, []);

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h4 className="mb-0 text-danger">Logs de Triagem</h4>
          <small className="text-muted">
          </small>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID Log</th>
                <th>ID Triagem</th>
                <th>Ação</th>
                <th>Descrição</th>
                <th>Data Log</th>
              </tr>
            </thead>

            <tbody>
              {dados.map((d) => (
                <tr key={d.id_log}>
                  <td className="ps-4">{d.id_log}</td>
                  <td>{d.id_triagem}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {d.acao}
                    </span>
                  </td>
                  <td>{d.descricao}</td>
                  <td>{formatarData(d.data_log)}</td>
                </tr>
              ))}

              {dados.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Nenhum log encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaginaLogTriagemLista;