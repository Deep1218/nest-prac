import * as dotenv from 'dotenv';
dotenv.config();

import { userDBSourceOptions } from './data.source';
import { DataSource } from 'typeorm';
export default new DataSource(userDBSourceOptions);
