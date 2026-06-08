import Categoria from "../models/Categoria.js";


async function listar(req, res) {
    const dados = await Categoria.findAll();
    return res.json(dados);
}


async function selecionar(req, res) {
    const id = req.params.id;
    const dados = await Categoria.findByPk(id);
    return res.json(dados);
}


async function excluir(req, res) {
    const id = req.params.id;
    const dados = await Categoria.destroy({ where: { id: id } });
    return res.json(dados);
}


async function inserir(req, res) {
    const nome = req.body.nome;
    const valor_diaria = req.body.valor_diaria;


    const dados = await Categoria.create({
        nome: nome,
        valor_diaria: valor_diaria
    });


    return res.json(dados);
}


async function alterar(req, res) {
    const id = req.params.id;
    const nome = req.body.nome;
    const valor_diaria = req.body.valor_diaria;


    const dados = await Categoria.update({
        nome: nome,
        valor_diaria: valor_diaria
    }, {
        where: { id: id }
    });


    return res.json(dados);
}


export default { listar, selecionar, excluir, inserir, alterar };
