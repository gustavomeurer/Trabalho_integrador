import ClassificacaoRisco from "../models/ClassificacaoRisco.js";

async function listar(req, res) {
    const dados = await ClassificacaoRisco.findAll({
        order: [['prioridade', 'ASC']]
    });

    return res.json(dados);
}

async function selecionar(req, res) {
    const id = req.params.id;

    const dados = await ClassificacaoRisco.findByPk(id);

    if (!dados) {
        return res.status(404).send("Classificação de risco não encontrada");
    }

    return res.json(dados);
}

async function inserir(req, res) {
    const nivel = req.body.nivel;
    const descricao = req.body.descricao;
    const prioridade = req.body.prioridade;

    if (!nivel || !descricao || !prioridade) {
        return res.status(400).send("Informe nível, descrição e prioridade");
    }

    const dados = await ClassificacaoRisco.create({
        nivel: nivel,
        descricao: descricao,
        prioridade: prioridade
    });

    return res.json(dados);
}

async function alterar(req, res) {
    const id = req.params.id;

    const nivel = req.body.nivel;
    const descricao = req.body.descricao;
    const prioridade = req.body.prioridade;

    const classificacao = await ClassificacaoRisco.findByPk(id);

    if (!classificacao) {
        return res.status(404).send("Classificação de risco não encontrada");
    }

    const dados = await ClassificacaoRisco.update({
        nivel: nivel,
        descricao: descricao,
        prioridade: prioridade
    }, {
        where: { id_classificacao: id }
    });

    return res.json(dados);
}

async function excluir(req, res) {
    const id = req.params.id;

    const dados = await ClassificacaoRisco.destroy({
        where: { id_classificacao: id }
    });

    return res.json(dados);
}

export default { listar, selecionar, inserir, alterar, excluir };