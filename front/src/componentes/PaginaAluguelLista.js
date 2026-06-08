import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { del, get } from "../servicos/api";

function PaginaAluguelLista() {
  const navigate = useNavigate();

  const [alugueis, setAlugueis] = useState([]);

  const listar = async () => {
    try {
      const resposta = await get("alugueis");
      setAlugueis(resposta);
    } catch (error) {
      alert("Erro ao listar aluguéis: " + error);
    }
  };

  const excluir = async (id) => {
    const confirmar = window.confirm("Deseja realmente excluir este aluguel?");

    if (!confirmar) {
      return;
    }

    try {
      await del("alugueis/" + id);
      alert("Aluguel excluído com sucesso!");
      listar();
    } catch (error) {
      alert("Erro ao excluir aluguel: " + error);
    }
  };

  const editar = (id) => {
    navigate("/aluguel/" + id);
  };

  const novo = () => {
    navigate("/aluguel");
  };

  useEffect(() => {
    listar();
  }, []);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Aluguéis Cadastrados</h3>

        <button className="btn btn-success" onClick={novo}>
          Novo Aluguel
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente ID</th>
                <th>Veículo ID</th>
                <th>Data Retirada</th>
                <th>Data Devolução</th>
                <th>Dias</th>
                <th>Valor Total</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {alugueis.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    Nenhum aluguel cadastrado.
                  </td>
                </tr>
              ) : (
                alugueis.map((aluguel) => (
                  <tr key={aluguel.id}>
                    <td>{aluguel.id}</td>
                    <td>{aluguel.cliente_id}</td>
                    <td>{aluguel.veiculo_id}</td>
                    <td>{aluguel.data_retirada}</td>
                    <td>{aluguel.data_devolucao}</td>
                    <td>{aluguel.quantidade_dias}</td>
                    <td>
                      R$ {Number(aluguel.valor_total).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editar(aluguel.id)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => excluir(aluguel.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaginaAluguelLista;