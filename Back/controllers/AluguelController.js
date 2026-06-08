import Aluguel from "../models/Aluguel.js";
import Cliente from "../models/Cliente.js";
import Veiculo from "../models/Veiculo.js";
import Categoria from "../models/Categoria.js";


async function listar(req, res) {
    const dados = await Aluguel.findAll();
    return res.json(dados);
}


async function selecionar(req, res) {
    const id = req.params.id;
    const dados = await Aluguel.findByPk(id);
    return res.json(dados);
}


async function excluir(req, res) {
    const id = req.params.id;
    const dados = await Aluguel.destroy({ where: { id: id } });
    return res.json(dados);
}


async function inserir(req, res) {
    const cliente_id = req.body.cliente_id;
    const veiculo_id = req.body.veiculo_id;
    const data_retirada = req.body.data_retirada;
    const data_devolucao = req.body.data_devolucao;


    // validar cliente
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
        return res.status(404).send("Cliente não encontrado");
    }


    // validar veículo
    const veiculo = await Veiculo.findByPk(veiculo_id);
    if (!veiculo) {
        return res.status(404).send("Veículo não encontrado");
    }


    // buscar categoria do veículo
    const categoria = await Categoria.findByPk(veiculo.categoria_id);


    // cálculo de dias
    const retirada = new Date(data_retirada);
    const devolucao = new Date(data_devolucao);


    const diffTime = devolucao - retirada;
    const quantidade_dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


    if (quantidade_dias <= 0) {
        return res.status(400).send("Data de devolução inválida");
    }


    // cálculo valor total
    const valor_total = quantidade_dias * categoria.valor_diaria;


    const dados = await Aluguel.create({
        cliente_id: cliente_id,
        veiculo_id: veiculo_id,
        data_retirada: data_retirada,
        data_devolucao: data_devolucao,
        quantidade_dias: quantidade_dias,
        valor_total: valor_total
    });


    return res.json(dados);
}


async function alterar(req, res) {
    const id = req.params.id;


    const cliente_id = req.body.cliente_id;
    const veiculo_id = req.body.veiculo_id;
    const data_retirada = req.body.data_retirada;
    const data_devolucao = req.body.data_devolucao;


    const aluguel = await Aluguel.findByPk(id);
    if (!aluguel) {
        return res.status(404).send("Aluguel não encontrado");
    }


    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
        return res.status(404).send("Cliente não encontrado");
    }


    const veiculo = await Veiculo.findByPk(veiculo_id);
    if (!veiculo) {
        return res.status(404).send("Veículo não encontrado");
    }


    const categoria = await Categoria.findByPk(veiculo.categoria_id);
    if (!categoria) {
        return res.status(404).send("Categoria do veículo não encontrada");
    }


    const retirada = new Date(data_retirada);
    const devolucao = new Date(data_devolucao);


    const diffTime = devolucao - retirada;
    const quantidade_dias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


    if (quantidade_dias <= 0) {
        return res.status(400).send("Data de devolução inválida");
    }


    const valor_total = quantidade_dias * categoria.valor_diaria;


    const dados = await Aluguel.update({
        cliente_id: cliente_id,
        veiculo_id: veiculo_id,
        data_retirada: data_retirada,
        data_devolucao: data_devolucao,
        quantidade_dias: quantidade_dias,
        valor_total: valor_total
    }, {
        where: { id: id }
    });


    return res.json(dados);
}


export default { listar, selecionar, excluir, inserir, alterar };
