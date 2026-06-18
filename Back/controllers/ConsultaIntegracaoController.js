import ConsultaIntegracao from "../models/ConsultaIntegracao.js";

const G4_BASE_URL = "https://g4-consultations-backend.onrender.com";
const G4_API_KEY = "g4_e863e2cd295dcf6afaa0143598d6ad1d018ac10d18d042bf";

async function listar(req, res) {
    try {
        const dados = await ConsultaIntegracao.findAll({
            order: [["data_consulta", "ASC"]]
        });

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao listar consultas de integração:", error);
        return res.status(500).send(
            "Erro ao listar consultas de integração: " + error.message
        );
    }
}

async function selecionar(req, res) {
    try {
        const id = req.params.id;

        const dados = await ConsultaIntegracao.findByPk(id);

        if (!dados) {
            return res.status(404).send("Consulta de integração não encontrada");
        }

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao selecionar consulta de integração:", error);
        return res.status(500).send(
            "Erro ao selecionar consulta de integração: " + error.message
        );
    }
}

async function inserir(req, res) {
    try {
        const id_consulta_externa = req.body.id_consulta_externa;
        const nome_paciente = req.body.nome_paciente;
        const documento_paciente = req.body.documento_paciente;
        const data_consulta = req.body.data_consulta;
        const status_consulta = req.body.status_consulta;

        if (!id_consulta_externa || !nome_paciente || !data_consulta) {
            return res.status(400).send(
                "Informe id_consulta_externa, nome_paciente e data_consulta"
            );
        }

        const dados = await ConsultaIntegracao.create({
            id_consulta_externa: id_consulta_externa,
            nome_paciente: nome_paciente,
            documento_paciente: documento_paciente,
            data_consulta: data_consulta,
            status_consulta: status_consulta,
            data_importacao: new Date(),
            data_atualizacao: new Date()
        });

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao inserir consulta de integração:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).send("Esta consulta externa já foi importada.");
        }

        if (error.parent && error.parent.code === "23505") {
            return res.status(400).send("Esta consulta externa já foi importada.");
        }

        return res.status(500).send(
            "Erro ao inserir consulta de integração: " + error.message
        );
    }
}

async function alterar(req, res) {
    try {
        const id = req.params.id;

        const id_consulta_externa = req.body.id_consulta_externa;
        const nome_paciente = req.body.nome_paciente;
        const documento_paciente = req.body.documento_paciente;
        const data_consulta = req.body.data_consulta;
        const status_consulta = req.body.status_consulta;

        const consulta = await ConsultaIntegracao.findByPk(id);

        if (!consulta) {
            return res.status(404).send("Consulta de integração não encontrada");
        }

        const dados = await ConsultaIntegracao.update(
            {
                id_consulta_externa: id_consulta_externa,
                nome_paciente: nome_paciente,
                documento_paciente: documento_paciente,
                data_consulta: data_consulta,
                status_consulta: status_consulta,
                data_atualizacao: new Date()
            },
            {
                where: {
                    id_consulta_integracao: id
                }
            }
        );

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao alterar consulta de integração:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).send("Esta consulta externa já foi importada.");
        }

        if (error.parent && error.parent.code === "23505") {
            return res.status(400).send("Esta consulta externa já foi importada.");
        }

        return res.status(500).send(
            "Erro ao alterar consulta de integração: " + error.message
        );
    }
}

async function excluir(req, res) {
    try {
        const id = req.params.id;

        const dados = await ConsultaIntegracao.destroy({
            where: {
                id_consulta_integracao: id
            }
        });

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao excluir consulta de integração:", error);

        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).send(
                "Não é possível excluir esta consulta porque ela está vinculada a uma triagem."
            );
        }

        if (error.parent && error.parent.code === "23503") {
            return res.status(400).send(
                "Não é possível excluir esta consulta porque ela está vinculada a uma triagem."
            );
        }

        return res.status(500).send(
            "Erro ao excluir consulta de integração: " + error.message
        );
    }
}

function converterStatusG4(statusG4) {
    if (!statusG4) {
        return "recebida_api";
    }

    const status = statusG4.toString().toLowerCase();

    if (status === "scheduled") {
        return "agendada";
    }

    if (status === "completed") {
        return "realizada";
    }

    if (status === "cancelled") {
        return "cancelada";
    }

    return status;
}

async function importarG4(req, res) {
    try {
        const resposta = await fetch(
            `${G4_BASE_URL}/external/v1/consultations?status=scheduled`,
            {
                method: "GET",
                headers: {
                    "X-API-Key": G4_API_KEY,
                    Accept: "application/json"
                }
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error("Erro retornado pela API do G4:", dados);
            return res.status(resposta.status).json(dados);
        }

        if (!dados.data || !Array.isArray(dados.data)) {
            return res.status(500).send(
                "Retorno da API do G4 em formato inesperado. Esperado: objeto com propriedade data em formato de array."
            );
        }

        const consultas = dados.data;

        let total_processado = 0;
        let total_inserido = 0;
        let total_atualizado = 0;
        let total_ignorado = 0;

        for (const consulta of consultas) {
            const id_consulta_externa = consulta.id;
            const nome_paciente = consulta.patientId;
            const documento_paciente = consulta.patientId;
            const data_consulta = consulta.scheduledAt;
            const status_consulta = converterStatusG4(consulta.status);

            if (!id_consulta_externa || !nome_paciente || !data_consulta) {
                total_ignorado++;
                continue;
            }

            total_processado++;

            const consultaExistente = await ConsultaIntegracao.findOne({
                where: {
                    id_consulta_externa: id_consulta_externa
                }
            });

            if (consultaExistente) {
                await ConsultaIntegracao.update(
                    {
                        nome_paciente: nome_paciente,
                        documento_paciente: documento_paciente,
                        data_consulta: data_consulta,
                        status_consulta: status_consulta,
                        data_atualizacao: new Date()
                    },
                    {
                        where: {
                            id_consulta_integracao:
                                consultaExistente.id_consulta_integracao
                        }
                    }
                );

                total_atualizado++;
            } else {
                await ConsultaIntegracao.create({
                    id_consulta_externa: id_consulta_externa,
                    nome_paciente: nome_paciente,
                    documento_paciente: documento_paciente,
                    data_consulta: data_consulta,
                    status_consulta: status_consulta,
                    data_importacao: new Date(),
                    data_atualizacao: new Date()
                });

                total_inserido++;
            }
        }

        return res.json({
            mensagem: "Consultas importadas do G4 com sucesso.",
            total_recebido_api_g4: consultas.length,
            total_processado: total_processado,
            total_inserido: total_inserido,
            total_atualizado: total_atualizado,
            total_ignorado: total_ignorado
        });
    } catch (error) {
        console.error("Erro ao importar consultas do G4:", error);

        return res.status(500).send(
            "Erro ao importar consultas do G4: " + error.message
        );
    }
}

export default {
    listar,
    selecionar,
    inserir,
    alterar,
    excluir,
    importarG4
};