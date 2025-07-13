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


// Above are for Localhost 

// Below SQl are of My Hostinger Served Hosting Server 

//  import mysql from 'mysql2/promise';

// let connection;

// export async function connectDB() {
//   if (!connection) {
//     connection = await mysql.createConnection({
//       host: 'srv1675.hstgr.io',  
//       user: 'u743509934_admin',
//       password: 'Ritesh@709',
//       database: 'u743509934_product',
//       port: 3306,
//     });
//     console.log('Connected to MySQL');
//   }
//   return connection;
// }
