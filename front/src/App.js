import Menu from './componentes/Menu';
import PaginaCatalogo from './componentes/PaginaCatalogo';

import PaginaClienteLista from './componentes/PaginaClienteLista';
import PaginaClienteCadastro from './componentes/PaginaClienteCadastro';

import PaginaVeiculoLista from './componentes/PaginaVeiculoLista';
import PaginaVeiculoCadastro from './componentes/PaginaVeiculoCadastro';

import PaginaCategoriaLista from './componentes/PaginaCategoriaLista';
import PaginaCategoriaCadastro from './componentes/PaginaCategoriaCadastro';

import PaginaAluguelLista from "./componentes/PaginaAluguelLista";
import PaginaAluguelCadastro from "./componentes/PaginaAluguelCadastro";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Menu />

        <Routes>
          <Route path="/" element={<PaginaCatalogo />} />

          <Route path="/clientes" element={<PaginaClienteLista />} />
          <Route path="/cliente" element={<PaginaClienteCadastro />} />
          <Route path="/cliente/:id" element={<PaginaClienteCadastro />} />

          <Route path="/veiculos" element={<PaginaVeiculoLista />} />
          <Route path="/veiculo" element={<PaginaVeiculoCadastro />} />
          <Route path="/veiculo/:id" element={<PaginaVeiculoCadastro />} />

          <Route path="/categorias" element={<PaginaCategoriaLista />} />
          <Route path="/categoria" element={<PaginaCategoriaCadastro />} />
          <Route path="/categoria/:id" element={<PaginaCategoriaCadastro />} />

          <Route path="/alugueis" element={<PaginaAluguelLista />} />
          <Route path="/aluguel" element={<PaginaAluguelCadastro />} />
          <Route path="/aluguel/:id" element={<PaginaAluguelCadastro />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;