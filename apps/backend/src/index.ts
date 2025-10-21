import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import routes from './routes';
const app = express();
app.use(express.json());
app.use('/', routes);

import path from 'path';

app.get('/', (req, res) => res.send('DiscordBoto backend running!'));

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
	const staticPath = path.join(__dirname, '..', '..', 'apps', 'frontend', 'dist');
	app.use(express.static(staticPath));
	app.get('*', (req, res) => res.sendFile(path.join(staticPath, 'index.html')));
}

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => console.log(`Backend listening on port ${port}`));
