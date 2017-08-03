import app from './app';
import { hostname } from 'os';

const port = hostname() === 'personal-website' ? 80 : 8000;
console.log(`listening on ${port}`);
app.listen(port);