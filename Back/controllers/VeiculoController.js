import Veiculo from "../models/Veiculo.js";
import Categoria from "../models/Categoria.js";


async function listar(req, res) {
    const dados = await Veiculo.findAll();
    return res.json(dados);
}


async function selecionar(req, res) {
    const id = req.params.id;
    const dados = await Veiculo.findByPk(id);
    return res.json(dados);
}


async function excluir(req, res) {
    const id = req.params.id;
    const dados = await Veiculo.destroy({ where: { id: id } });
    return res.json(dados);
}


async function inserir(req, res) {
    const modelo = req.body.modelo;
    const marca = req.body.marca;
    const placa = req.body.placa;
    const categoria_id = req.body.categoria_id;


    // validar categoria
    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria) {
        return res.status(404).send("Categoria não encontrada");
    }


    const dados = await Veiculo.create({
        modelo: modelo,
        marca: marca,
        placa: placa,
        categoria_id: categoria_id
    });


    return res.json(dados);
}


async function alterar(req, res) {
    const id = req.params.id;


    const modelo = req.body.modelo;
    const marca = req.body.marca;
    const placa = req.body.placa;
    const categoria_id = req.body.categoria_id;


    // validar categoria
    const categoria = await Categoria.findByPk(categoria_id);
    if (!categoria) {
        return res.status(404).send("Categoria não encontrada");
    }


    const dados = await Veiculo.update({
        modelo: modelo,
        marca: marca,
        placa: placa,
        categoria_id: categoria_id
    }, {
        where: { id: id }
    });


    return res.json(dados);
}


export default { listar, selecionar, excluir, inserir, alterar };
