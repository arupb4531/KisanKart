const EmbeddedPostgres = require('embedded-postgres').default;

async function startDb() {
  console.log("Starting embedded Postgres...");
  const pg = new EmbeddedPostgres({
    databaseDir: './.pgdata',
    user: 'postgres',
    password: 'password',
    port: 5432,
    database: 'kisankart'
  });

  await pg.initialise();
  await pg.start();
  
  console.log("Postgres started at postgresql://postgres:password@localhost:5432/kisankart");
  
  // Wait indefinitely
  await new Promise(() => {});
}

startDb().catch(console.error);
