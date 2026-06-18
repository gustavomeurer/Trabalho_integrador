import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Triagem = banco.define(
    'triagem',
    {
        id_triagem: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_consulta_integracao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        id_classificacao: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sintomas_relatados: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        temperatura: {
            type: DataTypes.DECIMAL(4, 1),
            allowNull: true
        },
        frequencia_cardiaca: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        gravidade_sintomas: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        prioridade_atendimento: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        observacoes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status_triagem: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        data_triagem: {
            type: DataTypes.DATE,
            allowNull: false
        },
        data_atualizacao: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        timestamps: false
    }
);

export default Triagem;