const request = require('supertest');
const app = require('../app');

describe('EthioClear app smoke test', () => {
  it('loads the app and responds to health checks without crashing', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(600);
    expect(response.body).toHaveProperty('success');
  });
});
