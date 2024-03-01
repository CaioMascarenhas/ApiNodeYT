import mysql from 'mysql2'

const conexao = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Auschwitz10@',
    database: 'api_node'
})

conexao.connect()

export default conexao