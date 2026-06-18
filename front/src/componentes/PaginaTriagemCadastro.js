import { useEffect, useState } from "react";
import { get, post } from "../servicos/api";

function PaginaTriagemCadastro() {
    const [consultas, setConsultas] = useState([]);

    const [id_consulta_integracao, setIdConsultaIntegracao] = useState("");
    const [id_consulta_externa, setIdConsultaExterna] = useState("");
    const [nome_paciente, setNomePaciente] = useState("");
    const [documento_paciente, setDocumentoPaciente] = useState("");

    const [sintomas_relatados, setSintomasRelatados] = useState("");
    const [temperatura, setTemperatura] = useState("");
    const [frequencia_cardiaca, setFrequenciaCardiaca] = useState("");
    const [gravidade_sintomas, setGravidadeSintomas] = useState("leve");
    const [observacoes, setObservacoes] = useState("");

    useEffect(() => {
        carregarConsultas();
    }, []);

    async function carregarConsultas() {
        try {
            const resposta = await get("/consultas-integracao");

            if (Array.isArray(resposta)) {
                setConsultas(resposta);
            } else if (Array.isArray(resposta.data)) {
                setConsultas(resposta.data);
            } else {
                setConsultas([]);
            }
        } catch (error) {
            console.error("Erro ao carregar consultas:", error);

            const mensagemErro =
                error.response?.data?.mensagem ||
                error.response?.data?.erro ||
                error.response?.data?.message ||
                error.response?.data ||
                error.message;

            alert("Erro ao carregar consultas: " + mensagemErro);
            setConsultas([]);
        }
    }

    function selecionarConsulta(event) {
        const idSelecionado = event.target.value;

        setIdConsultaIntegracao(idSelecionado);

        const consultaSelecionada = consultas.find(
            (consulta) =>
                String(consulta.id_consulta_integracao) === String(idSelecionado)
        );

        if (consultaSelecionada) {
            setIdConsultaExterna(consultaSelecionada.id_consulta_externa || "");
            setNomePaciente(consultaSelecionada.nome_paciente || "");
            setDocumentoPaciente(consultaSelecionada.documento_paciente || "");
        } else {
            setIdConsultaExterna("");
            setNomePaciente("");
            setDocumentoPaciente("");
        }
    }

    function validarDados() {
        if (!id_consulta_integracao) {
            alert("Selecione uma consulta agendada do G4.");
            return false;
        }

        if (!sintomas_relatados.trim()) {
            alert("Informe os sintomas relatados.");
            return false;
        }

        if (!gravidade_sintomas) {
            alert("Informe a gravidade dos sintomas.");
            return false;
        }

        if (temperatura !== "") {
            const temperaturaNumero = Number(temperatura);

            if (Number.isNaN(temperaturaNumero)) {
                alert("Informe uma temperatura válida.");
                return false;
            }

            if (temperaturaNumero < 30 || temperaturaNumero > 45) {
                alert("Informe uma temperatura válida entre 30 e 45.");
                return false;
            }
        }

        if (frequencia_cardiaca !== "") {
            const frequenciaNumero = Number(frequencia_cardiaca);

            if (Number.isNaN(frequenciaNumero)) {
                alert("Informe uma frequência cardíaca válida.");
                return false;
            }

            if (frequenciaNumero < 30 || frequenciaNumero > 220) {
                alert("Informe uma frequência cardíaca válida entre 30 e 220.");
                return false;
            }
        }

        return true;
    }

    async function inserir(event) {
        event.preventDefault();

        try {
            if (!validarDados()) {
                return;
            }

            const dados = {
                id_consulta_integracao: Number(id_consulta_integracao),
                sintomas_relatados: sintomas_relatados.trim(),
                temperatura: temperatura !== "" ? Number(temperatura) : null,
                frequencia_cardiaca:
                    frequencia_cardiaca !== "" ? Number(frequencia_cardiaca) : null,
                gravidade_sintomas: gravidade_sintomas,
                observacoes: observacoes.trim() === "" ? null : observacoes.trim()
            };

            await post("/triagens", dados);

            alert("Triagem cadastrada com sucesso!");
            window.location.href = "/triagens";
        } catch (error) {
            console.error("Erro ao inserir triagem:", error);

            const mensagemErro =
                error.response?.data?.mensagem ||
                error.response?.data?.erro ||
                error.response?.data?.message ||
                error.response?.data ||
                error.message;

            alert("Erro ao inserir triagem: " + mensagemErro);
        }
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-danger text-white">
                    <h4>Registrar Nova Triagem</h4>
                </div>

                <div className="card-body">
                    <form onSubmit={inserir}>
                        <div className="mb-3">
                            <label className="form-label">
                                <strong>Consulta Agendada G4</strong>
                            </label>

                            <select
                                className="form-control"
                                value={id_consulta_integracao}
                                onChange={selecionarConsulta}
                                required
                            >
                                <option value="">Selecione uma consulta</option>

                                {Array.isArray(consultas) &&
                                    consultas.map((consulta) => (
                                        <option
                                            key={consulta.id_consulta_integracao}
                                            value={consulta.id_consulta_integracao}
                                        >
                                            {consulta.id_consulta_externa} -{" "}
                                            {consulta.nome_paciente}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    <strong>ID Consulta Externa</strong>
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={id_consulta_externa}
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    <strong>Nome do Paciente</strong>
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={nome_paciente}
                                    disabled
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                <strong>Documento do Paciente</strong>
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={documento_paciente}
                                disabled
                                readOnly
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                <strong>Sintomas Relatados</strong>
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                value={sintomas_relatados}
                                onChange={(event) =>
                                    setSintomasRelatados(event.target.value)
                                }
                                placeholder="Descreva os sintomas relatados pelo paciente"
                                required
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">
                                    <strong>Temperatura</strong>
                                </label>

                                <input
                                    type="number"
                                    step="0.1"
                                    min="30"
                                    max="45"
                                    className="form-control"
                                    value={temperatura}
                                    onChange={(event) =>
                                        setTemperatura(event.target.value)
                                    }
                                    placeholder="Ex: 38.5"
                                />

                                <small className="text-muted">
                                    Informe um valor entre 30 e 45.
                                </small>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">
                                    <strong>Frequência Cardíaca</strong>
                                </label>

                                <input
                                    type="number"
                                    min="30"
                                    max="220"
                                    className="form-control"
                                    value={frequencia_cardiaca}
                                    onChange={(event) =>
                                        setFrequenciaCardiaca(event.target.value)
                                    }
                                    placeholder="Ex: 110"
                                />

                                <small className="text-muted">
                                    Informe um valor entre 30 e 220.
                                </small>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">
                                    <strong>Gravidade dos Sintomas</strong>
                                </label>

                                <select
                                    className="form-control"
                                    value={gravidade_sintomas}
                                    onChange={(event) =>
                                        setGravidadeSintomas(event.target.value)
                                    }
                                    required
                                >
                                    <option value="leve">Leve</option>
                                    <option value="moderada">Moderada</option>
                                    <option value="grave">Grave</option>
                                    <option value="critica">Crítica</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                <strong>Observações</strong>
                            </label>

                            <textarea
                                className="form-control"
                                rows="3"
                                value={observacoes}
                                onChange={(event) => setObservacoes(event.target.value)}
                                placeholder="Observações adicionais, se houver"
                            ></textarea>

                            <small className="text-muted">
                                Se não houver observações, deixe este campo em branco.
                            </small>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between">
                            <a href="/triagens" className="btn btn-secondary">
                                Voltar para a lista
                            </a>

                            <button type="submit" className="btn btn-danger">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PaginaTriagemCadastro;