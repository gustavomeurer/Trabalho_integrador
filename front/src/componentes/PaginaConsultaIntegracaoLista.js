import { get, post } from "../servicos/api";
import { useEffect, useState } from "react";

function PaginaConsultaIntegracaoLista() {
  const [dados, setDados] = useState([]);

  const listar = async () => {
    try {
      const resposta = await get("consultas-integracao");
      setDados(resposta);
    } catch (error) {
      alert("Erro ao listar consultas de integração: " + error);
    }
  };

  const importarG4 = async () => {
    try {
      const resposta = await post("g4/importar-consultas", {});

      alert(
        "Consultas importadas do G4 com sucesso! Total processado: " +
          resposta.total_processado
      );

      listar();
    } catch (error) {
      alert("Erro ao importar consultas do G4: " + error);
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
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-danger">Consultas recebidas do G4</h4>

          <button className="btn btn-outline-danger" onClick={importarG4}>
            Importar do G4
          </button>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID</th>
                <th>ID Externo G4</th>
                <th>Paciente</th>
                <th>Documento</th>
                <th>Data Consulta</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {dados.map((d) => (
                <tr key={d.id_consulta_integracao}>
                  <td className="ps-4">{d.id_consulta_integracao}</td>
                  <td>{d.id_consulta_externa}</td>
                  <td>{d.nome_paciente}</td>
                  <td>{d.documento_paciente}</td>
                  <td>{formatarData(d.data_consulta)}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {d.status_consulta}
                    </span>
                  </td>
                </tr>
              ))}

              {dados.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Nenhuma consulta recebida do G4 até o momento.
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

export default PaginaConsultaIntegracaoLista;