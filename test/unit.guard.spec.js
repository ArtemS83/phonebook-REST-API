const guard = require('../helpers/guard');
const passport = require('passport');
const { HttpCode } = require('../helpers/constants');

describe('Unit test guard', () => {
  let user, req, res, next;

  beforeEach(() => {
    // console.log('Выполнить в начале каждого теста(test,it)');
    user = { token: '111' };
    req = { user, get: jest.fn(header => `Bearer ${user.token}`) };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(data => data),
    };
    next = jest.fn();
  });

  it('run guard with user', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(null, user);
      },
    );

    guard(req, res, next);

    expect(req.get).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('run guard without user', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(null, false);
      },
    );

    guard(req, res, next);

    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authorized',
    });
  });

  test('run guard with wrong token', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        // callback(null, { token: '111' }); // с таким значением тест падает
        callback(null, { token: '222' });
      },
    );

    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authorized',
    });
  });

  test('run guard with error', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, callback) => (req, res, next) => {
        callback(new Error('UPS!'), {});
      },
    );

    guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveReturnedWith({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Not authorized',
    });
  });
});
// токен пользователя валидный
// пользователь не передал токен в Authorization заголовке
// токен пользователя невалидный
// error
