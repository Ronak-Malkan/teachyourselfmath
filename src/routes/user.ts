import express from 'express';
import { ClientError } from '../services/errors';
import { UserService } from '../services/UserService';
import { state } from '../state';
import { HTTP_CODE } from '../types';
import { extractBearerToken, sendStandardResponse } from '../utils';

const userRouter: express.Router = express.Router();
const userService = UserService.getInstance(state);

const injectUserInfoMiddleWare = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authToken = extractBearerToken(req.headers.authorization as string);
  const user = await userService.verifyAndDecodeToken(authToken);
  if (user === null) {
    sendStandardResponse(
      HTTP_CODE.UNAUTHORIZED,
      {
        status: 'error',
        message: 'Unauthorized!',
      },
      res,
    );
  } else {
    req.body.user = user;
    next();
  }
};

const injectOptionalUserInfoMiddleWare = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authToken = extractBearerToken(req.headers.authorization as string);
  const user = await userService.verifyAndDecodeToken(authToken);
  if (user !== null) {
    req.body.user = user;
  }
  next();
};

userRouter.post('/signup', async (req, res) => {
  try {
    const insertedUser = await userService.signup(req.body);
    sendStandardResponse(
      HTTP_CODE.CREATED,
      {
        status: 'success',
        data: insertedUser,
      },
      res,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      sendStandardResponse(
        HTTP_CODE.CLIENT_ERROR,
        {
          status: 'error',
          message: err?.message,
        },
        res,
      );
    } else {
      console.log(err);
      sendStandardResponse(
        HTTP_CODE.SERVER_ERROR,
        {
          status: 'error',
        },
        res,
      );
    }
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const user = await userService.login(req.body);
    sendStandardResponse(
      HTTP_CODE.OK,
      {
        status: 'success',
        data: user,
      },
      res,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      sendStandardResponse(
        HTTP_CODE.CLIENT_ERROR,
        {
          status: 'error',
          message: err?.message,
        },
        res,
      );
    } else {
      console.log(err);
      sendStandardResponse(
        HTTP_CODE.SERVER_ERROR,
        {
          status: 'error',
        },
        res,
      );
    }
  }
});

userRouter.get('/profile', injectUserInfoMiddleWare, async (req, res) => {
  try {
    const user = await userService.getProfile(req.body.user.id);
    sendStandardResponse(
      HTTP_CODE.OK,
      {
        status: 'success',
        data: user,
      },
      res,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      sendStandardResponse(
        HTTP_CODE.CLIENT_ERROR,
        {
          status: 'error',
          message: err?.message,
        },
        res,
      );
    } else {
      console.log(err);
      sendStandardResponse(
        HTTP_CODE.SERVER_ERROR,
        {
          status: 'error',
        },
        res,
      );
    }
  }
});

userRouter.put('/profile', injectUserInfoMiddleWare, async (req, res) => {
  try {
    const user = await userService.updateProfile(req.body.user.id, req.body);
    sendStandardResponse(
      HTTP_CODE.OK,
      {
        status: 'success',
        data: user,
      },
      res,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      sendStandardResponse(
        HTTP_CODE.CLIENT_ERROR,
        {
          status: 'error',
          message: err?.message,
        },
        res,
      );
    } else {
      console.log(err);
      sendStandardResponse(
        HTTP_CODE.SERVER_ERROR,
        {
          status: 'error',
        },
        res,
      );
    }
  }
});

userRouter.put('/password', injectUserInfoMiddleWare, async (req, res) => {
  try {
    const user = await userService.updatePassword(req.body.user.id, req.body);
    sendStandardResponse(
      HTTP_CODE.OK,
      {
        status: 'success',
        data: user,
      },
      res,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      sendStandardResponse(
        HTTP_CODE.CLIENT_ERROR,
        {
          status: 'error',
          message: err?.message,
        },
        res,
      );
    } else {
      console.log(err);
      sendStandardResponse(
        HTTP_CODE.SERVER_ERROR,
        {
          status: 'error',
        },
        res,
      );
    }
  }
});

userRouter.post('/preferences', injectUserInfoMiddleWare, async (req, res) => {
  try {
    const user = await userService.updatePreferences(
      req.body.user.id,
      req.body.data,
    );
    sendStandardResponse(
      HTTP_CODE.OK,
      {
        status: 'success',
        data: user,
      },
      res,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      sendStandardResponse(
        HTTP_CODE.CLIENT_ERROR,
        {
          status: 'error',
          message: err?.message,
        },
        res,
      );
    } else {
      console.log(err);
      sendStandardResponse(
        HTTP_CODE.SERVER_ERROR,
        {
          status: 'error',
        },
        res,
      );
    }
  }
});

userRouter.post('/password/reset', async (req, res) => {
  try {
    const user = await userService.resetPassword(req.body);
    sendStandardResponse(
      HTTP_CODE.OK,
      {
        status: 'success',
        data: user,
      },
      res,
    );
  } catch (err) {
    if (err instanceof ClientError) {
      sendStandardResponse(
        HTTP_CODE.CLIENT_ERROR,
        {
          status: 'error',
          message: err?.message,
        },
        res,
      );
    } else {
      console.log(err);
      sendStandardResponse(
        HTTP_CODE.SERVER_ERROR,
        {
          status: 'error',
        },
        res,
      );
    }
  }
});

export {
  userRouter,
  injectUserInfoMiddleWare,
  injectOptionalUserInfoMiddleWare,
};
