import { DataSource } from "typeorm";
import { Example } from "./entities/Example";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [Example],
    subscribers: [],
    migrations: [],
})