const request = require("supertest");
const app = require("../index");
const { connectTestDB, closeTestDB } = require("./setupTestDB");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Authentication API", () => {
  let testUser;

  beforeEach(async () => {
    testUser = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "user",
    });
    await testUser.save();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "New User",
        email: "newuser@example.com",
        password: "securepassword",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("newuser@example.com");
  });

  it("should return 400 if email already exists", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe("User already exists");
  });

  it("should log in a user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("testuser@example.com");
  });

  it("should return 400 for incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe("Invalid credentials");
  });

  it("should return 404 for non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "notfound@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toBe("Invalid credentials");
  });


  it("should return 401 for accessing protected route without token", async () => {
    const res = await request(app).get("/api/media/recommendations");

    expect(res.statusCode).toBe(401);
    expect(res.body).toBe("No token, authorization denied");
  });

  it("should return 403 for accessing admin-only route as a user", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password123",
      });

    const token = loginRes.body.token;
    const res = await request(app)
      .post("/api/media/upload")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toBe("Access denied");
  });
});