import { get, del } from "../servicos/api";
import { useEffect, useState } from "react";

function PaginaCategoriaLista() {
  const [dados, setDados] = useState([]);

  const listar = async () => {
    try {
      const resposta = await get("categorias");
      setDados(resposta);
    } catch (error) {
      alert("Erro ao listar categorias: " + error);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm("Deseja excluir esta categoria?")) {
      return;
    }

    try {
      const resposta = await del("categorias/" + id);

      if (resposta === 1) {
        alert("Categoria excluída com sucesso.");
        listar();
      } else {
        alert("Categoria não excluída.");
      }
    } catch (error) {
      alert("Erro ao excluir categoria: " + error);
    }
  };

  useEffect(() => {
    listar();
  }, []);

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 text-primary">Categorias Cadastradas</h4>

          <a href="/categoria" className="btn btn-success">
            <i className="bi bi-plus-circle me-2" />
            Nova Categoria
          </a>
        </div>

        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID</th>
                <th>Nome</th>
                <th>Valor da Diária</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {dados.map((d) => (
                <tr key={d.id}>
                  <td className="ps-4">{d.id}</td>

                  <td>{d.nome}</td>

                  <td>
                    R$ {Number(d.valor_diaria).toFixed(2)}
                  </td>

                  <td className="text-center">
                    <div className="btn-group">
                      <a
                        href={"/categoria/" + d.id}
                        className="btn btn-sm btn-outline-warning"
                        title="Editar Categoria"
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
                    Nenhuma categoria cadastrada.
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

export default PaginaCategoriaLista;