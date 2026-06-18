import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const LogTriagem = banco.define(
    'log_triagem',
    {
        id_log: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_triagem: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        acao: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        data_log: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

export default LogTriagem;