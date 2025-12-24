import request from 'supertest';
import app from '../src/app.js';

describe('Subscription Endpoint', () => {
  test('Should create subscription with valid data', async () => {
    const subscriptionData = {
      priceId: 'price_1Oxxxxx', // Reemplazar con priceId real
      email: 'test@example.com',
      fullName: 'Usuario Test',
      phone: '123456789',
      curso: 'Curso de Marketing Digital'
    };

    const response = await request(app)
      .post('/api/subscriptions/create')
      .send(subscriptionData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.url).toBeDefined();
  });

  test('Should reject subscription without required fields', async () => {
    const invalidData = {
      priceId: 'price_1Oxxxxx',
      email: 'test@example.com'
      // Falta fullName, curso
    };

    const response = await request(app)
      .post('/api/subscriptions/create')
      .send(invalidData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});