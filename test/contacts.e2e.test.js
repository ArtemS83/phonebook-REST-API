const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { newContact, newUser } = require('./data/data');
const app = require('../app');
const db = require('../model/db');
const Contact = require('../model/schemas/contact');
const User = require('../model/schemas/user');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');

describe('E2E test the routes api/contacts', () => {
  let user, token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
    user = await Users.create(newUser);
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, JWT_SECRET_KEY);
    await Users.updateToken(user._id, token);
  });

  beforeEach(async () => {
    await Contact.deleteMany();
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect();
  });

  describe('should handle GET request', () => {
    it('should response 200 status for get all contacts', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Array);
    });

    it('should response 200 status for get contact by id', async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
    });

    it('should response 400 status for get contact by id', async () => {
      const res = await request(app)
        .get(`/api/contacts/123`) // not valid contactId
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });

    it('should response 404 status for get contact by id', async () => {
      const res = await request(app)
        .get(`/api/contacts/60b8b30c2f59930994688b14`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
    });
  });

  describe('should handle POST request', () => {
    it('should response 201 status for create contact', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(newContact);

      expect(res.status).toEqual(HttpCode.CREATED);
      expect(res.body).toBeDefined();
    });
    it('should response 400 status without required field name', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ phone: '000-000-00' });

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });
  });

  describe('should handle PATCH request', () => {
    it('should response 200 status update contact-field favorite', async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });

      const res = await request(app)
        .patch(`/api/contacts/${contact._id}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ favorite: true });

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.favorite).toBe(true);
    });

    it('should response 400 status without required field favorite', async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });

      const res = await request(app)
        .patch(`/api/contacts/${contact._id}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ phone: '000-000-00' });

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });

    it('should response 404 status update contact-field favorite', async () => {
      const res = await request(app)
        .patch(`/api/contacts/60b8b30c2f59930994688b14/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ favorite: true });

      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
    });
  });

  describe('should handle DELETE request', () => {
    it('should response 200 status for get contact by id', async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const res = await request(app)
        .delete(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
    });

    it('should response 404 status for get contact by id', async () => {
      const res = await request(app)
        .delete(`/api/contacts/60b8b30c2f59930994688b14`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
    });
  });
  describe('should handle PUT request', () => {}); // update done in unit.contacts.test
});
