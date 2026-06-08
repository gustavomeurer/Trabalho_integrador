import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get, post, put } from "../servicos/api";

function PaginaClienteCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");

  const voltar = () => {
    navigate("/clientes");
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
      cpf: cpf
    };

    try {
      await post("clientes", objeto);
      voltar();
    } catch (error) {
      alert("Erro ao inserir: " + error);
    }
  };

  const alterar = async () => {
    const objeto = {
      nome: nome,
      cpf: cpf
    };

    try {
      await put("clientes/" + id, objeto);
      voltar();
    } catch (error) {
      alert("Erro ao alterar: " + error);
    }
  };

  const selecionar = async () => {
    try {
      const resposta = await get("clientes/" + id);

      setNome(resposta.nome);
      setCpf(resposta.cpf);
    } catch (error) {
      alert("Erro ao selecionar cliente: " + error);
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
                {id ? "Editar Cliente" : "Dados do Novo Cliente"}
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
                  <label className="form-label fw-bold">Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Nome completo"
                    onChange={(e) => setNome(e.target.value)}
                    value={nome}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">CPF</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    maxLength="14"
                    placeholder="Ex: 123.456.789-00"
                    onChange={(e) => setCpf(e.target.value)}
                    value={cpf}
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

export default PaginaClienteCadastro;