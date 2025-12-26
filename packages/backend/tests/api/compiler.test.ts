import request from 'supertest';
import app from '../../src/index';
import { describe, it, expect } from 'vitest';

describe('POST /api/v1/public/compiler/compile', () => {
  it('compiles simple source', async () => {
    const res = await request(app)
      .post('/api/v1/public/compiler/compile')
      .send({ source: 'contract Token { resource Balance; }' });

    expect(res.status).toBe(200);
    expect(res.body.move).toBeDefined();
  });
});
