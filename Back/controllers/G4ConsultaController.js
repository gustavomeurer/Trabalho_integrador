import ConsultaIntegracao from "../models/ConsultaIntegracao.js";

const G4_BASE_URL = "https://g4-consultations-backend.onrender.com";
const G4_API_KEY = "g4_e863e2cd295dcf6afaa0143598d6ad1d018ac10d18d042bf";

async function listarConsultasG4(req, res) {
    try {
        const resposta = await fetch(`${G4_BASE_URL}/external/v1/consultations`, {
            method: "GET",
            headers: {
                "x-api-key": G4_API_KEY
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            return res.status(resposta.status).json(dados);
        }

        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({
            erro: true,
            mensagem: "Erro ao consultar API do G4.",
            detalhe: error.message
        });
    }
}

async function importarConsultasG4(req, res) {
    try {
        const resposta = await fetch(`${G4_BASE_URL}/external/v1/consultations?status=scheduled`, {
            method: "GET",
            headers: {
                "x-api-key": G4_API_KEY
            }
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            return res.status(resposta.status).json(dados);
        }

        const consultas = dados.data || [];

        const consultasImportadas = [];

        for (const consulta of consultas) {
            const idConsultaExterna = consulta.id;
            const patientId = consulta.patientId;
            const dataConsulta = consulta.scheduledAt;
            const statusConsulta = consulta.status || "scheduled";

            const nomePaciente = "Paciente " + patientId;
            const documentoPaciente = patientId;

            const [registro, criado] = await ConsultaIntegracao.findOrCreate({
                where: {
                    id_consulta_externa: idConsultaExterna
                },
                defaults: {
                    id_consulta_externa: idConsultaExterna,
                    nome_paciente: nomePaciente,
                    documento_paciente: documentoPaciente,
                    data_consulta: dataConsulta,
                    status_consulta: statusConsulta,
                    data_importacao: new Date(),
                    data_atualizacao: new Date()
                }
            });

            if (!criado) {
                await ConsultaIntegracao.update(
                    {
                        nome_paciente: nomePaciente,
                        documento_paciente: documentoPaciente,
                        data_consulta: dataConsulta,
                        status_consulta: statusConsulta,
                        data_atualizacao: new Date()
                    },
                    {
                        where: {
                            id_consulta_integracao: registro.id_consulta_integracao
                        }
                    }
                );
            }

            consultasImportadas.push({
                id_consulta_externa: idConsultaExterna,
                patientId: patientId,
                nome_paciente: nomePaciente,
                documento_paciente: documentoPaciente,
                data_consulta: dataConsulta,
                status_consulta: statusConsulta,
                criado: criado
            });
        }

        return res.status(200).json({
            mensagem: "Consultas importadas do G4 com sucesso.",
            total_recebido_g4: consultas.length,
            total_processado: consultasImportadas.length,
            consultas: consultasImportadas
        });
    } catch (error) {
        return res.status(500).json({
            erro: true,
            mensagem: "Erro ao importar consultas do G4.",
            detalhe: error.message
        });
    }
}

export default {
    listarConsultasG4,
    importarConsultasG4
};