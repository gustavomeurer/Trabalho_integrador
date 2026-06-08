import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get, post, put } from "../servicos/api";

function PaginaCategoriaCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nome, setNome] = useState("");
  const [valorDiaria, setValorDiaria] = useState("");

  const voltar = () => {
    navigate("/categorias");
  };

  const salvar = async () => {
    if (id) {
      await alterar();
    } else {
      await inserir();
    }
  };

  const inserir = async () => {
    const objeto = {
      nome: nome,
      valor_diaria: valorDiaria
    };

    try {
      await post("categorias", objeto);
      voltar();
    } catch (error) {
      alert("Erro ao inserir categoria: " + error);
    }
  };

  const alterar = async () => {
    const objeto = {
      nome: nome,
      valor_diaria: valorDiaria
    };

    try {
      await put("categorias/" + id, objeto);
      voltar();
    } catch (error) {
      alert("Erro ao alterar categoria: " + error);
    }
  };

  const selecionar = async () => {
    try {
      const resposta = await get("categorias/" + id);

      setNome(resposta.nome);
      setValorDiaria(resposta.valor_diaria);
    } catch (error) {
      alert("Erro ao selecionar categoria: " + error);
    }
  };

  useEffect(() => {
    if (id) {
      selecionar();
    }
  }, [id]);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0">
                {id ? "Editar Categoria" : "Dados da Nova Categoria"}
              </h5>
            </div>

            <div className="card-body p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  salvar();
                }}
              >
                <div className="mb-3">
                  <label className="form-label fw-bold">Nome da Categoria</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ex: Econômico, Executivo, Premium"
                    onChange={(e) => setNome(e.target.value)}
                    value={nome}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Valor da Diária</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    required
                    placeholder="Ex: 150.00"
                    onChange={(e) => setValorDiaria(e.target.value)}
                    value={valorDiaria}
                  />
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    onClick={voltar}
                    className="btn btn-link text-muted"
                  >
                    Voltar para a lista
                  </button>

                  <button type="submit" className="btn btn-primary px-5">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaCategoriaCadastro;