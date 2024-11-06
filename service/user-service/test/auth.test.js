import supertest from "supertest";
import { app } from "../src/server";
import { UserUtils } from "./utilstest";

describe('POST /api/auth/register', () => {

  afterEach(async () => {
    await UserUtils.delete();
  });

  it('should return 400 if request body is invalid', async () => {
    const response = await supertest(app)
      .post('/api/auth/register')
      .send({
        name: "test",
        email: "test@example.com",
        password: "123"
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('should return 201 if user is registered successfully', async () => {
    const response = await supertest(app)
      .post('/api/auth/register')
      .send({
        name: "test",
        email: "test@example.com",
        password: "123456"
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Register Success");
    expect(response.body.data.name).toBe("test");
    expect(response.body.data.email).toBe("test@example.com");
  });

});

describe('POST /api/auth/login', () => {

  beforeEach(async () => {
    await UserUtils.create();
  });

  afterEach(async () => {
    await UserUtils.delete();
  });

  it('should return 400 if email is invalid', async () => {
    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'secret1234'
      });

    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Invalid credentials");
  });

  it('should return 400 if password is invalid', async () => {
    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrong12345'
      });

    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Invalid credentials");
  });

  it('should return 200 if login success', async () => {
    const response = await supertest(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'secret1234'
      });

    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Login success");
    expect(response.body.token).toBeDefined();
  });

});