import LogTriagem from "../models/LogTriagem.js";

async function listar(req, res) {
    const dados = await LogTriagem.findAll({
        order: [['data_log', 'DESC']]
    });

    return res.json(dados);
}

async function selecionar(req, res) {
    const id = req.params.id;

    const dados = await LogTriagem.findByPk(id);

    if (!dados) {
        return res.status(404).send("Log de triagem não encontrado");
    }

    return res.json(dados);
}

async function listarPorTriagem(req, res) {
    const id_triagem = req.params.id_triagem;

    const dados = await LogTriagem.findAll({
        where: { id_triagem: id_triagem },
        order: [['data_log', 'DESC']]
    });

    return res.json(dados);
}

export default { listar, selecionar, listarPorTriagem };