import { environment as prodEnvironment } from './environment.production';
import { environment as devEnvironment } from './environment.development';

const currentEnvironment = process.env['NODE_ENV'] === 'production' ? prodEnvironment : devEnvironment;

export const environment = {
    ...currentEnvironment
};