import banco from "../Banco.js";
import { QueryTypes } from "sequelize";

import Triagem from "../models/Triagem.js";
import ConsultaIntegracao from "../models/ConsultaIntegracao.js";
import ClassificacaoRisco from "../models/ClassificacaoRisco.js";

function normalizarGravidade(valor) {
    if (!valor) {
        return null;
    }

    return valor
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

async function listar(req, res) {
    try {
        const dados = await Triagem.findAll({
            order: [["id_triagem", "ASC"]]
        });

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao listar triagens:", error);
        return res.status(500).send("Erro ao listar triagens: " + error.message);
    }
}

async function listarView(req, res) {
    try {
        const dados = await banco.query(
            "SELECT * FROM vw_triagens_prioridade ORDER BY id_triagem ASC",
            {
                type: QueryTypes.SELECT
            }
        );

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao listar view de triagens:", error);
        return res.status(500).send("Erro ao listar view de triagens: " + error.message);
    }
}

async function listarAgenda(req, res) {
    try {
        const dados = await banco.query(
            `SELECT
                id_triagem,
                id_consulta_integracao,
                id_consulta_externa,
                nome_paciente,
                classificacao_risco,
                prioridade_classificacao,
                prioridade_atendimento,
                status_triagem,
                data_triagem
            FROM vw_triagens_prioridade
            ORDER BY prioridade_atendimento ASC, data_triagem ASC`,
            {
                type: QueryTypes.SELECT
            }
        );

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao listar triagens para agenda:", error);
        return res.status(500).send("Erro ao listar triagens para agenda: " + error.message);
    }
}

async function selecionar(req, res) {
    try {
        const id = req.params.id;

        const dados = await Triagem.findByPk(id);

        if (!dados) {
            return res.status(404).send("Triagem não encontrada.");
        }

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao selecionar triagem:", error);
        return res.status(500).send("Erro ao selecionar triagem: " + error.message);
    }
}

async function selecionarView(req, res) {
    try {
        const id = req.params.id;

        const dados = await banco.query(
            "SELECT * FROM vw_triagens_prioridade WHERE id_triagem = :id",
            {
                replacements: {
                    id: id
                },
                type: QueryTypes.SELECT
            }
        );

        if (dados.length === 0) {
            return res.status(404).send("Triagem não encontrada.");
        }

        return res.json(dados[0]);
    } catch (error) {
        console.error("Erro ao selecionar triagem na view:", error);
        return res.status(500).send("Erro ao selecionar triagem na view: " + error.message);
    }
}

async function inserir(req, res) {
    try {
        const id_consulta_integracao = req.body.id_consulta_integracao;
        const sintomas_relatados = req.body.sintomas_relatados;
        const temperatura = req.body.temperatura;
        const frequencia_cardiaca = req.body.frequencia_cardiaca;
        const gravidade_sintomas = normalizarGravidade(req.body.gravidade_sintomas);
        const observacoes = req.body.observacoes || null;

        if (!id_consulta_integracao) {
            return res.status(400).send("Informe a consulta agendada do G4.");
        }

        if (!sintomas_relatados) {
            return res.status(400).send("Informe os sintomas relatados.");
        }

        if (!gravidade_sintomas) {
            return res.status(400).send("Informe a gravidade dos sintomas.");
        }

        const gravidadesPermitidas = ["leve", "moderada", "grave", "critica"];

        if (!gravidadesPermitidas.includes(gravidade_sintomas)) {
            return res.status(400).send(
                "Gravidade dos sintomas inválida. Use: leve, moderada, grave ou critica."
            );
        }

        const consulta = await ConsultaIntegracao.findByPk(id_consulta_integracao);

        if (!consulta) {
            return res.status(400).send(
                "Consulta de integração inválida. A consulta selecionada não existe no banco."
            );
        }

        const triagemExistente = await Triagem.findOne({
            where: {
                id_consulta_integracao: id_consulta_integracao
            }
        });

        if (triagemExistente) {
            return res.status(400).send(
                "Esta consulta já possui uma triagem cadastrada."
            );
        }

        await banco.query(
            `CALL sp_registrar_triagem(
                :id_consulta_integracao,
                :sintomas_relatados,
                :temperatura,
                :frequencia_cardiaca,
                :gravidade_sintomas,
                :observacoes
            )`,
            {
                replacements: {
                    id_consulta_integracao: id_consulta_integracao,
                    sintomas_relatados: sintomas_relatados,
                    temperatura: temperatura || null,
                    frequencia_cardiaca: frequencia_cardiaca || null,
                    gravidade_sintomas: gravidade_sintomas,
                    observacoes: observacoes
                }
            }
        );

        const dados = await banco.query(
            `SELECT *
             FROM vw_triagens_prioridade
             WHERE id_consulta_integracao = :id_consulta_integracao
             ORDER BY id_triagem DESC
             LIMIT 1`,
            {
                replacements: {
                    id_consulta_integracao: id_consulta_integracao
                },
                type: QueryTypes.SELECT
            }
        );

        return res.status(201).json(dados[0]);
    } catch (error) {
        console.error("Erro ao inserir triagem:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).send(
                "Esta consulta já possui uma triagem cadastrada."
            );
        }

        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).send(
                "Consulta de integração inválida. Verifique se a consulta selecionada existe."
            );
        }

        if (error.parent && error.parent.code === "23505") {
            return res.status(400).send(
                "Esta consulta já possui uma triagem cadastrada."
            );
        }

        if (error.parent && error.parent.code === "23503") {
            return res.status(400).send(
                "Consulta de integração inválida. A consulta selecionada não existe."
            );
        }

        if (error.parent && error.parent.code === "23502") {
            return res.status(400).send(
                "Existe um campo obrigatório sem preenchimento no cadastro da triagem."
            );
        }

        if (
            error.parent &&
            error.parent.code === "23514" &&
            error.parent.constraint === "chk_gravidade_sintomas"
        ) {
            return res.status(400).send(
                "Gravidade dos sintomas inválida. Use: leve, moderada, grave ou critica."
            );
        }

        if (error.parent && error.parent.code === "23514") {
            return res.status(400).send(
                "Algum valor informado viola uma regra de validação do banco de dados."
            );
        }

        if (error.parent && error.parent.message) {
            return res.status(500).send(
                "Erro no banco de dados ao inserir triagem: " + error.parent.message
            );
        }

        return res.status(500).send("Erro ao inserir triagem: " + error.message);
    }
}

async function alterar(req, res) {
    try {
        const id = req.params.id;

        const id_consulta_integracao = req.body.id_consulta_integracao;
        const id_classificacao = req.body.id_classificacao;
        const sintomas_relatados = req.body.sintomas_relatados;
        const temperatura = req.body.temperatura;
        const frequencia_cardiaca = req.body.frequencia_cardiaca;
        const gravidade_sintomas = normalizarGravidade(req.body.gravidade_sintomas);
        const observacoes = req.body.observacoes;
        const status_triagem = req.body.status_triagem;

        const triagem = await Triagem.findByPk(id);

        if (!triagem) {
            return res.status(404).send("Triagem não encontrada.");
        }

        if (id_consulta_integracao) {
            const consulta = await ConsultaIntegracao.findByPk(id_consulta_integracao);

            if (!consulta) {
                return res.status(400).send("Consulta de integração não encontrada.");
            }
        }

        if (id_classificacao) {
            const classificacao = await ClassificacaoRisco.findByPk(id_classificacao);

            if (!classificacao) {
                return res.status(400).send("Classificação de risco não encontrada.");
            }
        }

        if (gravidade_sintomas) {
            const gravidadesPermitidas = ["leve", "moderada", "grave", "critica"];

            if (!gravidadesPermitidas.includes(gravidade_sintomas)) {
                return res.status(400).send(
                    "Gravidade dos sintomas inválida. Use: leve, moderada, grave ou critica."
                );
            }
        }

        const dados = await Triagem.update(
            {
                id_consulta_integracao: id_consulta_integracao,
                id_classificacao: id_classificacao,
                sintomas_relatados: sintomas_relatados,
                temperatura: temperatura,
                frequencia_cardiaca: frequencia_cardiaca,
                gravidade_sintomas: gravidade_sintomas,
                observacoes: observacoes,
                status_triagem: status_triagem,
                data_atualizacao: new Date()
            },
            {
                where: {
                    id_triagem: id
                }
            }
        );

        return res.json(dados);
    } catch (error) {
        console.error("Erro ao alterar triagem:", error);

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).send(
                "Esta consulta já possui uma triagem cadastrada."
            );
        }

        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).send(
                "Consulta ou classificação inválida."
            );
        }

        if (
            error.parent &&
            error.parent.code === "23514" &&
            error.parent.constraint === "chk_gravidade_sintomas"
        ) {
            return res.status(400).send(
                "Gravidade dos sintomas inválida. Use: leve, moderada, grave ou critica."
            );
        }

        if (error.parent && error.parent.code === "23514") {
            return res.status(400).send(
                "Algum valor informado viola uma regra de validação do banco de dados."
            );
        }

        if (error.parent && error.parent.message) {
            return res.status(500).send(
                "Erro no banco de dados ao alterar triagem: " + error.parent.message
            );
        }

        return res.status(500).send("Erro ao alterar triagem: " + error.message);
    }
}

async function excluir(req, res) {
    try {
        const id = req.params.id;

        const triagem = await Triagem.findByPk(id);

        if (!triagem) {
            return res.status(404).send("Triagem não encontrada.");
        }

        await banco.query(
            "DELETE FROM log_triagem WHERE id_triagem = :id_triagem",
            {
                replacements: {
                    id_triagem: id
                }
            }
        );

        const dados = await Triagem.destroy({
            where: {
                id_triagem: id
            }
        });

        return res.json({
            mensagem: "Triagem excluída com sucesso.",
            dados: dados
        });
    } catch (error) {
        console.error("Erro ao excluir triagem:", error);

        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).send(
                "Não foi possível excluir a triagem porque existem registros vinculados a ela."
            );
        }

        if (error.parent && error.parent.message) {
            return res.status(500).send(
                "Erro no banco de dados ao excluir triagem: " + error.parent.message
            );
        }

        return res.status(500).send("Erro ao excluir triagem: " + error.message);
    }
}

export default {
    listar,
    listarView,
    listarAgenda,
    selecionar,
    selecionarView,
    inserir,
    alterar,
    excluir
};