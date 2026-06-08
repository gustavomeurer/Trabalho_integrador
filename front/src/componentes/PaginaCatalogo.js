import CardVeiculo from "./CardVeiculo";

import Azul from "../assets/Azul.png";
import Branco from "../assets/Branco.png";
import Preto from "../assets/Preto.png";

function PaginaCatalogo() {
  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-car-front-fill me-2" />
          Carros Disponíveis
        </h2>

       
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 g-4">
        <CardVeiculo
          imagem={Azul}
          categoria="Econômico"
          titulo="Golf TSI 2014 1.4"
          descricao="Modelo econômico para uso urbano."
        />

        <CardVeiculo
          imagem={Branco}
          categoria="Executivo"
          titulo="Golf TSI 2014 1.4 S/Teto"
          descricao="Modelo confortável para viagens e trabalho."
        />

        <CardVeiculo
          imagem={Preto}
          categoria="Premium"
          titulo="Golf TSI 2017 1.4"
          descricao="Modelo premium com acabamento superior."
        />
      </div>
    </div>
  );
}

export default PaginaCatalogo;