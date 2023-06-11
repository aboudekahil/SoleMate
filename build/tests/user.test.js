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
                const body = {
                    apartment: "123",
                    building: "456",
                    city: "Tyr",
                    email_address: "aboudehkahil@gmail.com",
                    family_name: "kahil",
                    name: "abd el kader kahil",
                    password: "aboudeh2004",
                    payment_option: "Whish",
                    payment_values: {
                        OMT: null,
                        Whish: "123456789",
                    },
                    phone_number: "71493037",
                    street: "Bayak",
                };
                const response = await (0, supertest_1.default)(app_1.app)
                    .post("/api/v1/user/signup")
                    .send(body);
                expect(response.statusCode).toBe(http2_1.constants.HTTP_STATUS_CREATED);
            });
        });
    });
});
