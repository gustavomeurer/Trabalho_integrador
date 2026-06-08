import Cliente from "../models/Cliente.js";


async function listar(req, res) {
    const dados = await Cliente.findAll();
    return res.json(dados);
}


async function selecionar(req, res) {
    const id = req.params.id;
    const dados = await Cliente.findByPk(id);
    return res.json(dados);
}


async function excluir(req, res) {
    const id = req.params.id;
    const dados = await Cliente.destroy({ where: { id: id } });
    return res.json(dados);
}


async function inserir(req, res) {
    const nome = req.body.nome;
    const cpf = req.body.cpf;


    const dados = await Cliente.create({
        nome: nome,
        cpf: cpf
    });


    return res.json(dados);
}


async function alterar(req, res) {
    const id = req.params.id;
    const nome = req.body.nome;
    const cpf = req.body.cpf;


    const dados = await Cliente.update({
        nome: nome,
        cpf: cpf
    }, {
        where: { id: id }
    });


    return res.json(dados);
}


export default { listar, selecionar, excluir, inserir, alterar };
