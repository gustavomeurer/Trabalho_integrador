import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const ConsultaIntegracao = banco.define(
    'consulta_integracao',
    {
        id_consulta_integracao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id_consulta_externa: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        nome_paciente: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        documento_paciente: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        data_consulta: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status_consulta: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        data_importacao: {
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

export default ConsultaIntegracao;