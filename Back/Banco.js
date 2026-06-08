import { Sequelize } from "sequelize";


const banco = new Sequelize('t_024rent_car', 'postgres', 'Gustavomeurer1998', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    define: {
        timestamps: false,
        freezeTableName: true
    }
});


export default banco;