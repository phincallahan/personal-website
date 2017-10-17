import app from './app';
import { hostname } from 'os';

const port = process.env.npm_config_port || 8000;

console.log(`listening on ${port}`);
app.listen(port);