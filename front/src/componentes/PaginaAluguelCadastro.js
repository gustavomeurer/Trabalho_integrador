import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, post, put } from "../servicos/api";

function PaginaAluguelCadastro() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [dataRetirada, setDataRetirada] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [quantidadeDias, setQuantidadeDias] = useState("");
  const [valorTotal, setValorTotal] = useState("");

  const voltar = () => {
    navigate("/alugueis");
  };

  const carregarClientes = async () => {
    try {
      const resposta = await get("clientes");
      setClientes(resposta);
    } catch (error) {
      alert("Erro ao listar clientes: " + error);
    }
  };

  const carregarVeiculos = async () => {
    try {
      const resposta = await get("veiculos");
      setVeiculos(resposta);
    } catch (error) {
      alert("Erro ao listar veículos: " + error);
    }
  };

  const selecionar = async () => {
    try {
      const resposta = await get("alugueis/" + id);

      setClienteId(resposta.cliente_id);
      setVeiculoId(resposta.veiculo_id);
      setDataRetirada(resposta.data_retirada);
      setDataDevolucao(resposta.data_devolucao);
      setQuantidadeDias(resposta.quantidade_dias);
      setValorTotal(resposta.valor_total);
    } catch (error) {
      alert("Erro ao selecionar aluguel: " + error);
    }
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
      cliente_id: Number(clienteId),
      veiculo_id: Number(veiculoId),
      data_retirada: dataRetirada,
      data_devolucao: dataDevolucao,
      quantidade_dias: Number(quantidadeDias),
      valor_total: Number(valorTotal)
    };

    try {
      await post("alugueis", objeto);
      alert("Aluguel cadastrado com sucesso!");
      voltar();
    } catch (error) {
      alert("Erro ao inserir aluguel: " + error);
    }
  };

  const alterar = async () => {
    const objeto = {
      cliente_id: Number(clienteId),
      veiculo_id: Number(veiculoId),
      data_retirada: dataRetirada,
      data_devolucao: dataDevolucao,
      quantidade_dias: Number(quantidadeDias),
      valor_total: Number(valorTotal)
    };

    try {
      await put("alugueis/" + id, objeto);
      alert("Aluguel alterado com sucesso!");
      voltar();
    } catch (error) {
      alert("Erro ao alterar aluguel: " + error);
    }
  };

  useEffect(() => {
    carregarClientes();
    carregarVeiculos();

    if (id) {
      selecionar();
    }
  }, [id]);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0">
                {id ? "Editar Aluguel" : "Dados do Novo Aluguel"}
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
                  <label className="form-label fw-bold">Cliente</label>
                  <select
                    className="form-select"
                    required
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                  >
                    <option value="">Selecione um cliente</option>

                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome} - CPF: {cliente.cpf}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Veículo</label>
                  <select
                    className="form-select"
                    required
                    value={veiculoId}
                    onChange={(e) => setVeiculoId(e.target.value)}
                  >
                    <option value="">Selecione um veículo</option>

                    {veiculos.map((veiculo) => (
                      <option key={veiculo.id} value={veiculo.id}>
                        {veiculo.marca} {veiculo.modelo} - Placa: {veiculo.placa}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Data de Retirada</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={dataRetirada}
                      onChange={(e) => setDataRetirada(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Data de Devolução</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={dataDevolucao}
                      onChange={(e) => setDataDevolucao(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Quantidade de Dias</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="1"
                      placeholder="Ex: 3"
                      value={quantidadeDias}
                      onChange={(e) => setQuantidadeDias(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Valor Total</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="0"
                      step="0.01"
                      placeholder="Ex: 450.00"
                      value={valorTotal}
                      onChange={(e) => setValorTotal(e.target.value)}
                    />
                  </div>
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

export default PaginaAluguelCadastro;