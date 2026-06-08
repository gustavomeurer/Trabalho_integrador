import banco from "../Banco.js";
import { DataTypes } from "sequelize";


const Categoria = banco.define(
    'categorias',
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
        valor_diaria: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);


export default Categoria;