const { exec } = require('child_process');
const { Client } = require('pg');

require('dotenv').config();

const populate = () => {
  const pgclient2 = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ...(process.env.POSTGRES_CERT
      ? {
          ssl: {
            ca: (process.env.POSTGRES_CERT || '').replace(/\\n/g, '\n'),
          },
        }
      : {}),
  });
  pgclient2.connect();
  const cmd = `PGPASSWORD=${process.env.POSTGRES_PASSWORD} pg_restore --dbname ${process.env.POSTGRES_DATABASE} --host=${process.env.POSTGRES_HOST} --port=${process.env.POSTGRES_PORT} --username=${process.env.POSTGRES_USER} --no-owner --role=${process.env.POSTGRES_USER} db/dump.tar`;
  exec(cmd, {}, (error, stdout, stderr) => {
    if (error) throw error;
    if (stderr) throw stderr;
    console.log(stdout);
    process.exit(0);
  });
};

if (process.argv.findIndex((arg) => arg === '--just-populate') !== -1) {
  populate();
} else {
  const pgclient1 = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ...(process.env.POSTGRES_CERT
      ? {
          ssl: {
            ca: (process.env.POSTGRES_CERT || '').replace(/\\n/g, '\n'),
          },
        }
      : {}),
  });
  pgclient1.connect();
  const cmd = `CREATE DATABASE ${process.env.POSTGRES_DATABASE};`;
  pgclient1.query(cmd, (err) => {
    if (err) throw err;
    populate();
  });
}
