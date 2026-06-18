import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./componentes/Menu";

import PaginaInicio from "./componentes/PaginaInicio";
import PaginaConsultaIntegracaoLista from "./componentes/PaginaConsultaIntegracaoLista";
import PaginaTriagemLista from "./componentes/PaginaTriagemLista";
import PaginaTriagemCadastro from "./componentes/PaginaTriagemCadastro";
import PaginaClassificacaoRiscoLista from "./componentes/PaginaClassificacaoRiscoLista";
import PaginaLogTriagemLista from "./componentes/PaginaLogTriagemLista";

function App() {
    return (
        <BrowserRouter>
            <Menu />

            <Routes>
                <Route path="/" element={<PaginaInicio />} />

                <Route
                    path="/consultas-integracao"
                    element={<PaginaConsultaIntegracaoLista />}
                />

                <Route
                    path="/triagens"
                    element={<PaginaTriagemLista />}
                />

                <Route
                    path="/triagem"
                    element={<PaginaTriagemCadastro />}
                />

                <Route
                    path="/classificacoes-risco"
                    element={<PaginaClassificacaoRiscoLista />}
                />

                <Route
                    path="/logs-triagem"
                    element={<PaginaLogTriagemLista />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;