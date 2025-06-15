import request from 'supertest';

import { app } from '../src/app';

describe('Error Handling', () => {
  it('should return 404 for non-existent routes', async () => {
    await request(app)
      .get('/non-existent-route')
      .expect(404)
      .expect('Resource not found');
  });

  it('should return 404 when HTTP method is not supported', async () => {
    await request(app)
      .patch('/users') // Assuming PATCH is not implemented
      .expect(404)
      .expect('PATCH method is not supported');
  });

  it('should handle very long URLs', async () => {
    const longPath = '/users/' + 'a'.repeat(1000);
    await request(app).get(longPath).expect(404);
  });
});
