import request from 'supertest';

import { app } from '../src/app';

describe('Static Routes', () => {
  it('should handle GET /', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.text).toEqual('Hello World');
  });

  it('should handle GET /users', async () => {
    const response = await request(app).get('/users').expect(200);

    expect(response.text).toEqual('Get users');
  });

  it('should handle GET /books', async () => {
    const response = await request(app).get('/books').expect(200);

    expect(response.text).toEqual('Get books');
  });
});

describe('Dynamic Routes', () => {
  it('should handle GET /users/1', async () => {
    const response = await request(app).get('/users/1').expect(200);

    expect(response.body).toEqual({
      id: '1',
      name: 'Patryk'
    });
  });
});

describe('Combining static and dynamic', () => {
  it('should handle GET /users/1/details', async () => {
    const response = await request(app).get('/users/1/details').expect(200);

    expect(response.body).toEqual({
      userId: '1',
      birthDate: '2000-04-19',
      age: 25
    });
  });
});
