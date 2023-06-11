import { describe } from "node:test";
import supertest from "supertest";
import { app } from "../app";
import { constants } from "http2";
import { ErrorType } from "../errors/httpErrorHandling";

describe("/api/v1/user", () => {
  describe("POST /signup", () => {
    describe("given a valid request body", () => {
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

        const response = await supertest(app)
          .post("/api/v1/user/signup")

          .send(user_signup_body);

        expect(response.statusCode).toBe(constants.HTTP_STATUS_CREATED);
        expect(response.headers).toHaveProperty("set-cookie");

        expect(
          (response.headers["set-cookie"][0] as string).includes("session_id")
        ).toBe(true);
      });
    });

    describe("given invalid input", () => {
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

        const response = await supertest(app)
          .post("/api/v1/user/signup")
          .send(user_signup_body);

        expect(response.statusCode).toBe(constants.HTTP_STATUS_BAD_REQUEST);
        expect(response.body).toHaveProperty("errors");

        const email_error = response.body.errors.find(
          (error: ErrorType) => error.field === "email_address"
        );

        const city_error = response.body.errors.find(
          (error: ErrorType) => error.field === "city"
        );

        const phone_number_error = response.body.errors.find(
          (error: ErrorType) => error.field === "phone_number"
        );

        const payment_option_error = response.body.errors.find(
          (error: ErrorType) => error.field === "payment_option"
        );

        expect(email_error).toBeDefined();
        expect(city_error).toBeDefined();
        expect(phone_number_error).toBeDefined();
        expect(payment_option_error).toBeDefined();
      });
    });

    describe("given duplicate email", () => {
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

        const response = await supertest(app)
          .post("/api/v1/user/signup")
          .send(user_signup_body);

        expect(response.statusCode).toBe(constants.HTTP_STATUS_BAD_REQUEST);
      });
    });
  });

  describe("POST /login", () => {
    describe("valid credentials", () => {
      it("should log me in", async () => {
        const login_body = {
          email_address: "email123@gmail.com",
          password: "aboudeh2004",
        };

        const response = await supertest(app)
          .post("/api/v1/user/login")
          .send(login_body);

        console.log(response.body);

        expect(response.statusCode).toBe(constants.HTTP_STATUS_OK);
        expect(response.headers).toHaveProperty("set-cookie");

        expect(
          (response.headers["set-cookie"][0] as string).includes("session_id")
        ).toBe(true);
      });
    });
  });
});
