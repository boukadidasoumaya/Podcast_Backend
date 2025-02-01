import { Podcast } from "./podcast/entities/podcast.entity";
import { Episode } from "./episode/entities/episode.entity";
import { DataSource } from "typeorm";
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Podcast, Episode], // Add other entities here
    synchronize: false})
