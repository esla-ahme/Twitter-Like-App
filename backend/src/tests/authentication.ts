import { expect } from "chai";
import request from "supertest";
import app, { serverPromise } from "../app";
import {User} from "../models"
import { createUser, login } from "./requests/user-resolvers";
import db from "../db";
import jwt from "jsonwebtoken"

let server: any;

describe("authentication", (): void => {
    before(async () => {
        server = await serverPromise;
        await server.close();
        await server.listen();
    });

    describe("login mutation", () => {
        before(async () => {
            await db.sync({ force: true });
            await createUser("omarabdo997", "Omar Ali");
        });

        it("succeed login with email", async () => {
            const response = await login(
                "bilbo_baggins@shire.com",
                "myPrecious"
            );
            expect(response.body.data.login.token).to.not.be.null;
            const token = response.body.data.login.token
            const user = jwt.verify(token, process.env.TOKEN_SECRET!) as User
            expect(user.userName).to.be.equal("omarabdo997")
            expect(user.email).to.be.equal("bilbo_baggins@shire.com")
            expect(user.id).to.be.equal(1)
            expect(user.imageURL).to.be.null;
            expect(user.coverImageURL).to.be.null
        });

        it("succeed login with userName", async () => {
            const response = await login(
                "omarabdo997",
                "myPrecious"
            );
            expect(response.body.data.login.token).to.not.be.null;
            const token = response.body.data.login.token
            const user = jwt.verify(token, process.env.TOKEN_SECRET!) as User
            expect(user.userName).to.be.equal("omarabdo997")
            expect(user.email).to.be.equal("bilbo_baggins@shire.com")
            expect(user.id).to.be.equal(1)
            expect(user.imageURL).to.be.null;
            expect(user.coverImageURL).to.be.null
        });

        it("fail login with wrong password", async () => {
            const response = await login(
                "omarabdo997",
                "myPrecious2"
            );
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0].statusCode).to.be.equal(401);
            expect(response.body.errors[0].message).to.be.equal("The password you entered is incorrect!");
        });

        it("fail login with wrong userName and Email", async () => {
            const response = await login(
                "omarabdo997777",
                "myPrecious"
            );
            console.log(response.text)
            expect(response.body.errors).to.has.length(1);
            expect(response.body.errors[0].statusCode).to.be.equal(404);
            expect(response.body.errors[0].message).to.be.equal("No user was found with this user name or email!");
        });
    });

    after(async () => {
        await server.close();
    });
});
