import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const ClassificacaoRisco = banco.define(
    'classificacao_risco',
    {
        id_classificacao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nivel: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        descricao: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        prioridade: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

export default ClassificacaoRisco;