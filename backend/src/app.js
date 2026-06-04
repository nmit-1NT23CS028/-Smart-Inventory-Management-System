const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));
app.use(errorHandler);

module.exports = app;
