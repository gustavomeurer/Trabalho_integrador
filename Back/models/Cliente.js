import banco from "../Banco.js";
import { DataTypes } from "sequelize";


const Cliente = banco.define(
    'clientes',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps: false
    }
);


export default Cliente;
