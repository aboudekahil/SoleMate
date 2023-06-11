"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const http2_1 = require("http2");
(0, node_test_1.describe)("/api/v1/user", () => {
    (0, node_test_1.describe)("POST /signup", () => {
        (0, node_test_1.describe)("given a valid request body", () => {
            it("should return a 201 status code", async () => {
                const user_signup_body = {
                    apartment: "123",
                    building: "456",
                    city: "Tyr",
                    email_address: "email123@gmail.com",
                    family_name: "kahil",
                    name: "abd el kader kahil",
                    password: "aboudeh2004",
                    payment_option: "Whish",
                    payment_values: {
                        Whish: "123456789",
                    },
                    phone_number: "71493037",
                    street: "Bayak",
                };
                const response = await (0, supertest_1.default)(app_1.app)
                    .post("/api/v1/user/signup")
                    .send(user_signup_body);
                expect(response.statusCode).toBe(http2_1.constants.HTTP_STATUS_CREATED);
                expect(response.headers).toHaveProperty("set-cookie");
                expect(response.headers["set-cookie"][0].includes("session_id")).toBe(true);
            });
        });
        (0, node_test_1.describe)("given invalid input", () => {
            it("should return a 400 status code", async () => {
                const user_signup_body = {
                    apartment: "123",
                    building: "456",
                    city: "AA",
                    email_address: "email12",
                    family_name: "kahil",
                    name: "abd el kader kahil",
                    password: "aboudeh2004",
                    payment_option: "Whish",
                    payment_values: {
                        OMT: "null",
                        Whish: "123456789",
                    },
                    phone_number: "2",
                    street: "Bayak",
                };
                const response = await (0, supertest_1.default)(app_1.app)
                    .post("/api/v1/user/signup")
                    .send(user_signup_body);
                expect(response.statusCode).toBe(http2_1.constants.HTTP_STATUS_BAD_REQUEST);
                expect(response.body).toHaveProperty("errors");
                const email_error = response.body.errors.find((error) => error.field === "email_address");
                const city_error = response.body.errors.find((error) => error.field === "city");
                const phone_number_error = response.body.errors.find((error) => error.field === "phone_number");
                const payment_option_error = response.body.errors.find((error) => error.field === "payment_option");
                expect(email_error).toBeDefined();
                expect(city_error).toBeDefined();
                expect(phone_number_error).toBeDefined();
                expect(payment_option_error).toBeDefined();
            });
        });
        (0, node_test_1.describe)("given duplicate email", () => {
            it("should return a 201 status code", async () => {
                const user_signup_body = {
                    apartment: "123",
                    building: "456",
                    city: "Tyr",
                    email_address: "email123@gmail.com",
                    family_name: "kahil",
                    name: "abd el kader kahil",
                    password: "aboudeh2004",
                    payment_option: "Whish",
                    payment_values: {
                        Whish: "123456789",
                    },
                    phone_number: "71493037",
                    street: "Bayak",
                };
                const response = await (0, supertest_1.default)(app_1.app)
                    .post("/api/v1/user/signup")
                    .send(user_signup_body);
                expect(response.statusCode).toBe(http2_1.constants.HTTP_STATUS_BAD_REQUEST);
            });
        });
    });
    (0, node_test_1.describe)("POST /login", () => {
        (0, node_test_1.describe)("valid credentials", () => {
            it("should log me in", async () => {
                const login_body = {
                    email_address: "email123@gmail.com",
                    password: "aboudeh2004",
                };
                const response = await (0, supertest_1.default)(app_1.app)
                    .post("/api/v1/user/login")
                    .send(login_body);
                console.log(response.body);
                expect(response.statusCode).toBe(http2_1.constants.HTTP_STATUS_OK);
                expect(response.headers).toHaveProperty("set-cookie");
                expect(response.headers["set-cookie"][0].includes("session_id")).toBe(true);
            });
        });
    });
});
