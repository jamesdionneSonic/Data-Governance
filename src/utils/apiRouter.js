import { Router } from 'express';

function wrapHandler(handler) {
  if (typeof handler !== 'function') {
    return handler;
  }

  if (handler.length === 4) {
    return handler;
  }

  return function wrappedHandler(req, res, next) {
    try {
      const result = handler(req, res, next);
      if (result && typeof result.then === 'function') {
        result.catch(next);
      }
      return result;
    } catch (error) {
      return next(error);
    }
  };
}

function wrapArg(arg) {
  if (Array.isArray(arg)) {
    return arg.map(wrapArg);
  }

  return wrapHandler(arg);
}

export function createApiRouter() {
  const router = Router();
  const methods = ['use', 'all', 'get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

  methods.forEach((method) => {
    const original = router[method].bind(router);
    router[method] = (...args) => original(...args.map(wrapArg));
  });

  return router;
}

export default createApiRouter;
