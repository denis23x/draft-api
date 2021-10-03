// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require("dotenv").config()
const migrationsFolder = "src/db/" + process.env.APP_MODE + "/migrations"

module.exports = {
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: [migrationsFolder + "/*.ts"],
  cli: {
    migrationsDir: migrationsFolder,
  },
}
