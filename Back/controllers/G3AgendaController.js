import banco from "../Banco.js";

function calcularPrioridade(classificacao) {
    if (!classificacao) {
        return {
            nivel_prioridade: 99,
            descricao_prioridade: "Sem classificação"
        };
    }

    const classificacaoNormalizada = classificacao.toString().toLowerCase();

    if (classificacaoNormalizada === "vermelha" || classificacaoNormalizada === "vermelho") {
        return {
            nivel_prioridade: 1,
            descricao_prioridade: "Emergência"
        };
    }

    if (classificacaoNormalizada === "laranja") {
        return {
            nivel_prioridade: 2,
            descricao_prioridade: "Muito urgente"
        };
    }

    if (classificacaoNormalizada === "amarelo" || classificacaoNormalizada === "amarela") {
        return {
            nivel_prioridade: 3,
            descricao_prioridade: "Urgente"
        };
    }

    if (classificacaoNormalizada === "verde") {
        return {
            nivel_prioridade: 4,
            descricao_prioridade: "Pouco urgente"
        };
    }

    if (classificacaoNormalizada === "azul") {
        return {
            nivel_prioridade: 5,
            descricao_prioridade: "Não urgente"
        };
    }

    return {
        nivel_prioridade: 99,
        descricao_prioridade: "Classificação desconhecida"
    };
}

async function listarPrioridadesAgenda(req, res) {
    try {
        const sql = `
            SELECT
                id_triagem,
                id_consulta_externa,
                nome_paciente,
                sintomas_relatados,
                temperatura,
                frequencia_cardiaca,
                classificacao_risco,
                status_triagem,
                data_triagem
            FROM vw_triagens_prioridade
            WHERE status_triagem = 'registrada'
            ORDER BY
                CASE
                    WHEN LOWER(classificacao_risco) IN ('vermelha', 'vermelho') THEN 1
                    WHEN LOWER(classificacao_risco) = 'laranja' THEN 2
                    WHEN LOWER(classificacao_risco) IN ('amarelo', 'amarela') THEN 3
                    WHEN LOWER(classificacao_risco) = 'verde' THEN 4
                    WHEN LOWER(classificacao_risco) = 'azul' THEN 5
                    ELSE 99
                END,
                data_triagem ASC
        `;

        const [triagens] = await banco.query(sql);

        const dadosFormatados = triagens.map((triagem) => {
            const prioridade = calcularPrioridade(triagem.classificacao_risco);

            return {
                id_triagem: triagem.id_triagem,
                id_consulta_externa: triagem.id_consulta_externa,
                nome_paciente: triagem.nome_paciente,
                sintomas_relatados: triagem.sintomas_relatados,
                temperatura: triagem.temperatura,
                frequencia_cardiaca: triagem.frequencia_cardiaca,
                classificacao_risco: triagem.classificacao_risco,
                nivel_prioridade: prioridade.nivel_prioridade,
                descricao_prioridade: prioridade.descricao_prioridade,
                status_triagem: triagem.status_triagem,
                data_triagem: triagem.data_triagem
            };
        });

        return res.json({
            sistema_origem: "G11 - Triagem",
            sistema_destino: "G3 - Agenda",
            objetivo: "Fornecer informações de prioridade para organização da agenda",
            total: dadosFormatados.length,
            dados: dadosFormatados
        });
    } catch (error) {
        console.error("Erro ao listar prioridades para agenda G3:", error);

        return res.status(500).send(
            "Erro ao listar prioridades para agenda G3: " + error.message
        );
    }
}

async function selecionarPrioridadePorConsulta(req, res) {
    try {
        const idConsultaExterna = req.params.idConsultaExterna;

        const sql = `
            SELECT
                id_triagem,
                id_consulta_externa,
                nome_paciente,
                sintomas_relatados,
                temperatura,
                frequencia_cardiaca,
                classificacao_risco,
                status_triagem,
                data_triagem
            FROM vw_triagens_prioridade
            WHERE id_consulta_externa = :idConsultaExterna
            ORDER BY data_triagem DESC
            LIMIT 1
        `;

        const [triagens] = await banco.query(sql, {
            replacements: {
                idConsultaExterna: idConsultaExterna
            }
        });

        if (!triagens || triagens.length === 0) {
            return res.status(404).json({
                mensagem: "Nenhuma triagem encontrada para esta consulta externa."
            });
        }

        const triagem = triagens[0];
        const prioridade = calcularPrioridade(triagem.classificacao_risco);

        return res.json({
            sistema_origem: "G11 - Triagem",
            sistema_destino: "G3 - Agenda",
            objetivo: "Consultar prioridade de uma consulta específica",
            dados: {
                id_triagem: triagem.id_triagem,
                id_consulta_externa: triagem.id_consulta_externa,
                nome_paciente: triagem.nome_paciente,
                sintomas_relatados: triagem.sintomas_relatados,
                temperatura: triagem.temperatura,
                frequencia_cardiaca: triagem.frequencia_cardiaca,
                classificacao_risco: triagem.classificacao_risco,
                nivel_prioridade: prioridade.nivel_prioridade,
                descricao_prioridade: prioridade.descricao_prioridade,
                status_triagem: triagem.status_triagem,
                data_triagem: triagem.data_triagem
            }
        });
    } catch (error) {
        console.error("Erro ao consultar prioridade por consulta externa:", error);

        return res.status(500).send(
            "Erro ao consultar prioridade por consulta externa: " + error.message
        );
    }
}

export default {
    listarPrioridadesAgenda,
    selecionarPrioridadePorConsulta
};