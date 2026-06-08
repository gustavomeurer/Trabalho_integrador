import Express from "express";
import cors from "cors";
import banco from "./Banco.js";

import categoria from "./controllers/CategoriaController.js";
import veiculo from "./controllers/VeiculoController.js";
import cliente from "./controllers/ClienteController.js";
import aluguel from "./controllers/AluguelController.js";

try {
    await banco.authenticate();
    console.log("Banco conectado com sucesso.");
} catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
}

const api = Express();

api.use(cors());
api.use(Express.json());

api.get("/teste", (req, res) => {
    res.send("API de aluguel de carros funcionando");
});

/*
    ROTAS DE CATEGORIAS
    POST, GET lista, GET por ID, PUT, DELETE
*/

api.get("/categorias", categoria.listar);
api.get("/categorias/:id", categoria.selecionar);
api.post("/categorias", categoria.inserir);
api.put("/categorias/:id", categoria.alterar);
api.delete("/categorias/:id", categoria.excluir);

/*
    ROTAS DE VEÍCULOS
    POST, GET lista, GET por ID, PUT, DELETE
*/

api.get("/veiculos", veiculo.listar);
api.get("/veiculos/:id", veiculo.selecionar);
api.post("/veiculos", veiculo.inserir);
api.put("/veiculos/:id", veiculo.alterar);
api.delete("/veiculos/:id", veiculo.excluir);

/*
    ROTAS DE CLIENTES
    POST, GET lista, GET por ID, PUT, DELETE
*/

api.get("/clientes", cliente.listar);
api.get("/clientes/:id", cliente.selecionar);
api.post("/clientes", cliente.inserir);
api.put("/clientes/:id", cliente.alterar);
api.delete("/clientes/:id", cliente.excluir);

/*
    ROTAS DE ALUGUÉIS
    POST, GET lista, GET por ID, PUT, DELETE
*/

api.get("/alugueis", aluguel.listar);
api.get("/alugueis/:id", aluguel.selecionar);
api.post("/alugueis", aluguel.inserir);
api.put("/alugueis/:id", aluguel.alterar);
api.delete("/alugueis/:id", aluguel.excluir);

api.listen(3000, () => {
    console.log("API rodando na porta 3000...");
});