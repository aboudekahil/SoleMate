import { describe } from "node:test";
import supertest from "supertest";
import { app } from "../app";
import { constants } from "http2";

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
            OMT: null,
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

    describe("given an invalid email", () => {
      it("should return a 400 status code", async () => {
        const user_signup_body = {
          apartment: "123",
          building: "456",
          city: "Tyr",
          email_address: "email12",
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

        const response = await supertest(app)
          .post("/api/v1/user/signup")
          .send(user_signup_body);

        expect(response.statusCode).toBe(constants.HTTP_STATUS_BAD_REQUEST);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Email is not valid");
      });
    });

    describe("given an invalid city", () => {
      it("should return a 400 status code", async () => {
        const user_signup_body = {
          apartment: "123",
          building: "456",
          city: "SEXXX",
          email_address: "email123@gmail.com",
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

        const response = await supertest(app)
          .post("/api/v1/user/signup")
          .set("Content-type", "application/json")
          .send(user_signup_body);

        expect(response.statusCode).toBe(constants.HTTP_STATUS_BAD_REQUEST);
        expect(response.body).toHaveProperty("message");

        expect(response.body.message).toBe("City is invalid");
      });
    });
  });
});
