// dbConnect.js
import mysql from 'mysql2/promise';

let connection;

export async function connectDB() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Ritesh@709',
      database: 'my_database',
    });
    console.log('Connected to MySQL');
  }
  return connection;
}
