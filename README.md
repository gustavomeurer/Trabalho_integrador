Sistema de Saúde Integrado — Módulo Triagem (G11)

Este repositório contém o Módulo de Triagem, desenvolvido como componente prático do Projeto Integrador 2026 para a disciplina de Engenharia de Software do curso de Sistemas de Informação da UNOESC.  O sistema faz a ponte entre as consultas agendadas e o atendimento médico, automatizando a classificação de risco do paciente na camada de banco de dados e fornecendo dados cruciais para a organização do fluxo hospitalar.  

Stack Utilizada

Backend: Node.js (Express / Sequelize)  
Banco de Dados Relacional: PostgreSQL (com uso de Stored Procedures, Triggers e Views)  
Testes de API: Insomnia  
Controle de Versão: Git / GitHub  

Como Rodar Localmente

Pré-requisitos
Node.js (versão 18 ou superior)
PostgreSQL 

Passo a Passo:

1. Clonar o repositório: git clone https://github.com/seu-usuario/modulo-triagem.git
cd modulo-triagem

2. Instalar as dependências do Node.js:
   ```bash
npm install

Configurar o Banco de Dados (PostgreSQL): 
Crie um banco de dados chamado triagem_db.
Execute o script SQL contido na raiz do projeto para criar as tabelas (consulta_integracao, classificacao_risco, triagem, log_triagem), além das procedures e triggers.  

Configurar as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto com as credenciais do seu banco:
Snippet de código
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=triagem_db
PORT=3000

5. Iniciar a aplicação:
   ```bash
npm start
O servidor estará ativo em http://localhost:3000.

Documentação da API e Integração

O módulo disponibiliza uma API REST para comunicação com o ecossistema de saúde:  

POST /api/triagem — Recebe dados de consultas externas e registra a triagem.  
GET /api/triagem — Consulta a view de triagens por prioridade.  
PUT /api/triagem/:id — Altera dados de uma triagem.  
DELETE /api/triagem/:id — Exclui um registro de triagem.  

Nota de Link para a Documentação: Disponibilizamos na raiz deste repositório um arquivo em Word contendo todas as instruções de uso detalhadas das nossas APIs para facilitar o consumo por parte dos outros grupos do ecossistema, especialmente o Grupo 3 (Agenda).  

Detalhes do Objetivo e Estrutura

Objetivo principal: Receber dados externos, registrar a triagem, classificar o risco automaticamente com base em sinais vitais (sintomas, temperatura, frequência cardíaca) e manter históricos de logs. 

Inteligência no Banco: Toda a lógica roda via banco através da procedure sp_registrar_triagem e das triggers trg_definir_prioridade_triagem (classificação automática) e trg_log_triagem (histórico de ações).  

Consulta Otimizada: A view vw_triagens_prioridade junta os dados clínicos organizados de forma consolidada por ordem de prioridade (Vermelho, Laranja, Amarelo, Verde e Azul).

Contatos do Grupo:
Eduardo de Oliveira Da Silva
Arthur Rodrigues  
Gustavo Meurer