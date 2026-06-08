import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get, post, put } from "../servicos/api";

function PaginaVeiculoCadastro() {
  const navegador = useNavigate();
  const { id } = useParams();

  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [placa, setPlaca] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [categorias, setCategorias] = useState([]);

  const voltar = () => {
    navegador("/veiculos");
  };

  const listarCategorias = async () => {
    try {
      const resposta = await get("categorias");
      setCategorias(resposta);
    } catch (error) {
      alert("Erro ao listar categorias: " + error);
    }
  };

  const salvar = async () => {
    if (id) {
      alterar();
    } else {
      inserir();
    }
  };

  const inserir = async () => {
    const objeto = {
      modelo: modelo,
      marca: marca,
      placa: placa,
      categoria_id: categoriaId
    };

    try {
      await post("veiculos", objeto);
      voltar();
    } catch (error) {
      alert("Erro ao inserir: " + error);
    }
  };

  const alterar = async () => {
    const objeto = {
      modelo: modelo,
      marca: marca,
      placa: placa,
      categoria_id: categoriaId
    };

    try {
      await put("veiculos/" + id, objeto);
      voltar();
    } catch (error) {
      alert("Erro ao alterar: " + error);
    }
  };

  const selecionar = async () => {
    try {
      const resposta = await get("veiculos/" + id);

      setModelo(resposta.modelo);
      setMarca(resposta.marca);
      setPlaca(resposta.placa);
      setCategoriaId(resposta.categoria_id);
    } catch (error) {
      alert("Erro ao selecionar veículo: " + error);
    }
  };

  useEffect(() => {
    listarCategorias();

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
                {id ? "Editar Veículo" : "Dados do Novo Veículo"}
              </h5>
            </div>

            <div className="card-body p-4">
              <>
                <div className="mb-3">
                  <label className="form-label fw-bold">Modelo</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ex: Onix, Corolla, Civic"
                    onChange={(e) => setModelo(e.target.value)}
                    value={modelo}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ex: Chevrolet, Toyota, Honda"
                    onChange={(e) => setMarca(e.target.value)}
                    value={marca}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Placa</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ex: ABC1D23"
                    onChange={(e) => setPlaca(e.target.value)}
                    value={placa}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Categoria</label>
                  <select
                    className="form-select"
                    required
                    onChange={(e) => setCategoriaId(e.target.value)}
                    value={categoriaId}
                  >
                    <option value="">Selecione uma categoria</option>

                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nome} - R$ {categoria.valor_diaria}
                      </option>
                    ))}
                  </select>
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

                  <button
                    type="button"
                    onClick={salvar}
                    className="btn btn-primary px-5"
                  >
                    Salvar
                  </button>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaVeiculoCadastro;