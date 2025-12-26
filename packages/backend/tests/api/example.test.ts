/// <reference types="vitest" />
import request from 'supertest';
import app from '../../src/api/app';
import { describe, it, expect } from "vitest";

describe('GET /api/v1/public/example/hello', () => {
  it('returns hello message', async () => {
    const res = await request(app).get('/api/v1/public/example/hello');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'hello' });
  });
});
