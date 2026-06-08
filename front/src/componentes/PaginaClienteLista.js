import { get, del } from "../servicos/api";
import { useEffect, useState } from "react";

function PaginaClienteLista() {
  const [dados, setDados] = useState([]);

  const listar = async () => {
    try {
      const resposta = await get("clientes");
      setDados(resposta);
    } catch (error) {
      alert("Erro ao listar: " + error);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm("Deseja excluir este cliente?")) {
      return;
    }

    try {
      const resposta = await del("clientes/" + id);

      if (resposta === 1) {
        alert("Excluído com sucesso");
        listar();
      } else {
        alert("Registro não excluído");
      }
    } catch (error) {
      alert("Erro ao excluir: " + error);
    }
  };

  useEffect(() => {
    listar();
  }, []);

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-primary">Clientes Cadastrados</h4>

          <a href="/cliente" className="btn btn-success">
            <i className="bi bi-plus-circle me-2" />
            Novo Cliente
          </a>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {dados.map((d) => (
                <tr key={d.id}>
                  <td className="ps-4">{d.id}</td>

                  <td>{d.nome}</td>

                  <td>
                    <code>{d.cpf}</code>
                  </td>

                  <td className="text-center">
                    <div className="btn-group">
                      <a
                        href={"/cliente/" + d.id}
                        className="btn btn-sm btn-outline-warning"
                        title="Editar Cliente"
                      >
                        <i className="bi bi-pencil" /> Editar
                      </a>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Excluir"
                        onClick={() => excluir(d.id)}
                      >
                        <i className="bi bi-trash" /> Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {dados.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Nenhum cliente cadastrado.
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

export default PaginaClienteLista;