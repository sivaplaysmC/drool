import { PrismaClient } from '@prisma/client';
import app from './src/app.js';
import 'dotenv/config.js';
import cors from 'cors';
import express from 'express';

import { Resend } from 'resend';
import { setuproutes } from './src/routes.js';

import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const port = process.env.PORT || 8080;

// initialize dependencies
export const prisma = new PrismaClient();

await prisma.$connect();

const resend = new Resend(process.env.RESEND_KEY);

// api documentation when DEV environment variable is set.
if (process.env.DEV === '1') {
	const swaggerJsDocs = YAML.load(path.resolve('openapi.yaml'));
	app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));
}

// FIXME use specific CORS rule when deploying to production
app.use(
	cors({
		origin: ['*'],
		methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
		credentials: true,
	})
);

setuproutes(app, prisma, resend);

app.listen(port, () => console.log(`listening on ${port}`));
