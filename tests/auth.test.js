require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("POST /api/users/login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should return 200 and valid token and user data", async () => {
    const loginData = {
      email: "testuser1@example.com",
      password: "abc12345",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
  });
});
