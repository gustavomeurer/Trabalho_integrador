import banco from "../Banco.js";
import { DataTypes } from "sequelize";


const Veiculo = banco.define(
    'veiculos',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        modelo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        marca: {
            type: DataTypes.STRING,
            allowNull: false
        },
        placa: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        categoria_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);


export default Veiculo;
