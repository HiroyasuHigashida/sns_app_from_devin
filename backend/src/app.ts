import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/global/errorHandler';
import { routes } from './routes';

export const app = express();

const allowedOrigins = [process.env.CLIENT_ROOT_URL];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps, curl requests, lambda without apigateway)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('Not allowed by CORS'), false);
      }
      return callback(null, true);
    },
  })
);

app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({extended: true,limit: process.env.REQUEST_LIMIT || '100kb',type: 'application/x-www-form-urlencoded'}));
app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '50mb' }));

routes(app);

app.use(errorHandler);
