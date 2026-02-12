import 'dotenv/config'
import { DataSource } from 'typeorm'

function buildDataSource(): DataSource {
  const dataSource = new DataSource({
    type: 'postgres',
    ...{
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
          }),
    },
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    ssl:
      process.env.DB_DONTUSE_SSL
        ? false
        : { rejectUnauthorized: false },
  })

  return dataSource
}

export default buildDataSource()
