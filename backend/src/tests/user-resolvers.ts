import { expect } from "chai";
import request from "supertest";
import app, { serverPromise } from "../app";

let server: any;

describe("user-resolvers", (): void => {
    before(async () => {
        server = await serverPromise;
        server.close();
        server.listen();
    });

    it("bye", async () => {
        const response = await request(app).post("/graphql").send({
            query: "query bye {bye}",
        });
        expect(response.body).has.property("data");
        expect(response.body.data).has.property("bye");
    });

    it("hi", async () => {
        const response = await request(app)
            .post("/graphql")
            .set("Content-Type", "application/json")
            .send({
                query: "query bye {bye}",
            });
        expect(response.body).has.property("data");
        expect(response.body.data).has.property("bye");
    });

    after(() => {
        server.close();
    });
});
