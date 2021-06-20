const request = require('supertest');
const { newUser2 } = require('./data/data');
const app = require('../app');
const db = require('../model/db');
const User = require('../model/schemas/user');
const { HttpCode } = require('../helpers/constants');
const fs = require('fs/promises');

jest.mock('cloudinary');

describe('E2E test the routes api/users', () => {
  let token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser2.email });
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser2.email });
    await mongo.disconnect();
  });

  it('should response 201 signup user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .send(newUser2);

    expect(res.status).toEqual(HttpCode.CREATED);
    expect(res.body).toBeDefined();
    expect(res.body.data.user).toBeInstanceOf(Object);
  });

  it('should response 409 signup user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .set('Accept', 'application/json')
      .send(newUser2);

    expect(res.status).toEqual(HttpCode.CONFLICT);
    expect(res.body).toBeDefined();
  });

  it('should response 200 login user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .send(newUser2);

    expect(res.status).toEqual(HttpCode.OK);
    expect(res.body).toBeDefined();
    expect(res.body.data.user).toBeInstanceOf(Object);
    expect(typeof res.body.data.token).toBe('string');
    token = res.body.data.token;
  });

  it('should response 400 login user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .set('Accept', 'application/json')
      .send({ ...newUser2, password: '12345' });

    expect(res.status).toEqual(HttpCode.BAD_REQUEST);
    expect(res.body).toBeDefined();
  });

  it('should response 401 login user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'fake@test.com', password: '1234567' });

    expect(res.status).toEqual(HttpCode.UNAUTHORIZED);
    expect(res.body).toBeDefined();
  });

  it('should response 200 current user', async () => {
    const res = await request(app)
      .get('/api/users/current')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toEqual(HttpCode.OK);
    expect(res.body).toBeDefined();
    expect(res.body.data).toBeInstanceOf(Object);
  });

  it('should response 200 upload avatar user', async () => {
    const buf = await fs.readFile('./test/data/default-avatar-female.jpg');
    const res = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', buf, 'default-avatar-female.jpg');

    expect(res.status).toEqual(HttpCode.OK);
    expect(res.body).toBeDefined();
    expect(res.body.data).toBeInstanceOf(Object);
    expect(typeof res.body.data.avatarURL).toBe('string');
    expect(res.body.data.avatarURL).toBe('urlAvatar');
  });

  it('should response 401 upload avatar user not valid token', async () => {
    const buf = await fs.readFile('./test/data/default-avatar-female.jpg');
    const res = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer lkjhgfd.lkjhgfd.kjhgfd`)
      .attach('avatar', buf, 'default-avatar-female.jpg');

    expect(res.status).toEqual(HttpCode.UNAUTHORIZED);
    expect(res.body).toBeDefined();
  });

  it('should response 204 logout user', async () => {
    const res = await request(app)
      .post('/api/users/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(HttpCode.NO_CONTENT);
  });
});
