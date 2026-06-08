import { get, del } from "../servicos/api";
import { useEffect, useState } from "react";

function PaginaVeiculoLista() {
    const [dados, setDados] = useState([]);

    const listar = async () => {
        try {
            const resposta = await get('veiculos');
            setDados(resposta);
        } catch (error) {
            alert("Erro ao listar: " + error);
        }
    }

    const excluir = async (id) => {
        if (!window.confirm('Deseja excluir este veículo?')) {
            return;
        }

        try {
            const resposta = await del('veiculos/' + id);

            if (resposta === 1) {
                alert('Excluído com sucesso.');
                listar();
            } else {
                alert('Registro não excluído.');
            }
        } catch (error) {
            alert("Erro ao excluir: " + error);
        }
    }

    useEffect(() => {
        listar();
    }, []);

    return (
        <div className="container my-5">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-primary">Veículos Cadastrados</h4>

                    <a href="/veiculo" className="btn btn-success">
                        <i className="bi bi-plus-circle me-2" />
                        Novo Veículo
                    </a>
                </div>

                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Modelo</th>
                                <th>Marca</th>
                                <th>Placa</th>
                                <th>Categoria</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dados.map((d) => (
                                <tr key={d.id}>
                                    <td className="ps-4">{d.id}</td>

                                    <td>{d.modelo}</td>

                                    <td>
                                        <code>{d.marca}</code>
                                    </td>

                                    <td>{d.placa}</td>

                                    <td>{d.categoria_id}</td>

                                    <td className="text-center">
                                        <div className="btn-group">
                                            <a
                                                href={'/veiculo/' + d.id}
                                                className="btn btn-sm btn-outline-warning"
                                                title="Editar Veículo"
                                            >
                                                <i className="bi bi-pencil" /> Editar
                                            </a>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                title="Excluir"
                                                onClick={() => excluir(d.id)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {dados.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        Nenhum veículo cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PaginaVeiculoLista;