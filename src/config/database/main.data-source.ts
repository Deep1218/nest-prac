import * as dotenv from 'dotenv';
dotenv.config();

import { mainDBSourceOptions } from './data.source';
import { DataSource } from 'typeorm';
export default new DataSource(mainDBSourceOptions);
