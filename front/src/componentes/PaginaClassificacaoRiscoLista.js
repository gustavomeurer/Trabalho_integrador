import { get } from "../servicos/api";
import { useEffect, useState } from "react";

function PaginaClassificacaoRiscoLista() {
  const [dados, setDados] = useState([]);

  const listar = async () => {
    try {
      const resposta = await get("classificacoes-risco");
      setDados(resposta);
    } catch (error) {
      alert("Erro ao listar classificações de risco: " + error);
    }
  };

  const classeRisco = (nivel) => {
    if (!nivel) {
      return "bg-secondary";
    }

    const valor = nivel.toLowerCase();

    if (valor.includes("vermelho")) {
      return "bg-danger";
    }

    if (valor.includes("laranja")) {
      return "bg-warning text-dark";
    }

    if (valor.includes("amarelo")) {
      return "bg-warning text-dark";
    }

    if (valor.includes("verde")) {
      return "bg-success";
    }

    if (valor.includes("azul")) {
      return "bg-primary";
    }

    return "bg-secondary";
  };

  useEffect(() => {
    listar();
  }, []);

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h4 className="mb-0 text-danger">Classificações de Risco</h4>
          <small className="text-muted">
          </small>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID</th>
                <th>Nível</th>
                <th>Descrição</th>
                <th>Prioridade</th>
              </tr>
            </thead>

            <tbody>
              {dados.map((d) => (
                <tr key={d.id_classificacao}>
                  <td className="ps-4">{d.id_classificacao}</td>

                  <td>
                    <span className={"badge " + classeRisco(d.nivel)}>
                      {d.nivel}
                    </span>
                  </td>

                  <td>{d.descricao}</td>

                  <td>
                    <strong>{d.prioridade}</strong>
                  </td>
                </tr>
              ))}

              {dados.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Nenhuma classificação cadastrada.
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

export default PaginaClassificacaoRiscoLista;