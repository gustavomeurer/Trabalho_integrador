import banco from "../Banco.js";
import { DataTypes } from "sequelize";


const Aluguel = banco.define(
    'alugueis',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        veiculo_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        data_retirada: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        data_devolucao: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        quantidade_dias: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        valor_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        }
    },
    {
        timestamps: false
    }
);


export default Aluguel;
