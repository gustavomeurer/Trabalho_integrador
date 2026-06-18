import express from "express";
import cors from "cors";

import banco from "./Banco.js";

import ClassificacaoRiscoController from "./controllers/ClassificacaoRiscoController.js";
import ConsultaIntegracaoController from "./controllers/ConsultaIntegracaoController.js";
import TriagemController from "./controllers/TriagemController.js";
import LogTriagemController from "./controllers/LogTriagemController.js";
import G3AgendaController from "./controllers/G3AgendaController.js";

const app = express();

app.use(cors());
app.use(express.json());

try {
    await banco.authenticate();
    console.log("Conexão com o banco de dados realizada com sucesso.");
} catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
}

app.get("/", (req, res) => {
    res.send("API do Sistema de Triagem Hospitalar funcionando.");
});

// integração com api do G4, aqui são as consultas. Vem pelo botão de importar no menu2

app.post("/g4/importar-consultas", ConsultaIntegracaoController.importarG4);


//rota de class risco
app.get("/classificacoes-risco", ClassificacaoRiscoController.listar);
app.get("/classificacoes-risco/:id", ClassificacaoRiscoController.selecionar);
app.post("/classificacoes-risco", ClassificacaoRiscoController.inserir);
app.put("/classificacoes-risco/:id", ClassificacaoRiscoController.alterar);
app.delete("/classificacoes-risco/:id", ClassificacaoRiscoController.excluir);


//rota das consultas de integracao do g4
app.get("/consultas-integracao", ConsultaIntegracaoController.listar);
app.get("/consultas-integracao/:id", ConsultaIntegracaoController.selecionar);
app.post("/consultas-integracao", ConsultaIntegracaoController.inserir);
app.put("/consultas-integracao/:id", ConsultaIntegracaoController.alterar);
app.delete("/consultas-integracao/:id", ConsultaIntegracaoController.excluir);


//rota das triagens
app.get("/triagens/view", TriagemController.listarView);
app.get("/triagens/agenda", TriagemController.listarAgenda);
app.get("/triagens/view/:id", TriagemController.selecionarView);

app.get("/triagens", TriagemController.listar);
app.get("/triagens/:id", TriagemController.selecionar);
app.post("/triagens", TriagemController.inserir);
app.put("/triagens/:id", TriagemController.alterar);
app.delete("/triagens/:id", TriagemController.excluir);


//rota dos logs da triagem. criei o log apenas para usar a trigger do BD que exigia o trabalho. N tem rota de exclusao
app.get("/logs-triagem", LogTriagemController.listar);
app.get("/logs-triagem/:id", LogTriagemController.selecionar);


//Integra com G3 a agenda. Eles irão consumir
app.get("/g3/agenda-prioridades", G3AgendaController.listarPrioridadesAgenda);
app.get(
    "/g3/agenda-prioridades/:idConsultaExterna",
    G3AgendaController.selecionarPrioridadePorConsulta
);


const porta = 3000;

app.listen(porta, () => {
    console.log("Servidor rodando na porta " + porta);
});