import express from 'express';
import request from 'supertest';
import { createApiRouter } from '../../src/utils/apiRouter.js';

describe('utils/apiRouter', () => {
  function createAppWithRouter(setupRoutes) {
    const app = express();
    const router = createApiRouter();

    setupRoutes(router);

    app.use(router);
    app.use((err, req, res, _next) => {
      res.status(err.status || 500).json({
        message: err.message,
      });
    });

    return { app, router };
  }

  test('routes sync exceptions to next(error)', async () => {
    const { app } = createAppWithRouter((router) => {
      router.get('/sync-error', () => {
        throw new Error('sync failure');
      });
    });

    const response = await request(app).get('/sync-error');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('sync failure');
  });

  test('routes rejected promises to next(error)', async () => {
    const { app } = createAppWithRouter((router) => {
      router.get('/async-error', async () => {
        throw new Error('async failure');
      });
    });

    const response = await request(app).get('/async-error');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('async failure');
  });

  test('supports array middleware arguments and preserves error handlers', async () => {
    const errorMiddleware = (err, req, res, _next) => {
      res.status(418).json({
        message: err.message,
      });
    };

    const { app, router } = createAppWithRouter((apiRouter) => {
      apiRouter.get(
        '/array-middleware',
        [
          (req, res, next) => {
            req.hitOne = true;
            next();
          },
          (req, res, next) => {
            req.hitTwo = true;
            next();
          },
        ],
        (req, res) => {
          res.json({
            ok: req.hitOne && req.hitTwo,
          });
        },
      );

      apiRouter.get('/handled-by-error-mw', () => {
        throw new Error('teapot');
      });

      apiRouter.use(errorMiddleware);
    });

    const arrayResponse = await request(app).get('/array-middleware');
    expect(arrayResponse.status).toBe(200);
    expect(arrayResponse.body.ok).toBe(true);

    const errorResponse = await request(app).get('/handled-by-error-mw');
    expect(errorResponse.status).toBe(418);
    expect(errorResponse.body.message).toBe('teapot');

    const stackHandlers = router.stack.map((layer) => layer.handle);
    expect(stackHandlers).toContain(errorMiddleware);
  });
});
