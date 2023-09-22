import { expect as _expect, use, request } from "chai";
const expect = _expect;
import chaiHttp from "chai-http";
import { Promise, set, connect, connection } from "mongoose";
import app from "../src/app.js";
import User from "../src/models/user";
import Album, { findOne, countDocuments } from "../src/models/album";
import Purchase from "../src/models/purchase";

use(chaiHttp);
Promise = global.Promise;
set("strictQuery", false);

describe("server", () => {
  const albumData = Object.freeze({
    title: "Appetite for Destruction",
    performer: "Guns N' Roses",
    cost: 20,
  });

  beforeEach(() =>
    connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  );

  afterEach((done) => connection.db.dropDatabase(() => connection.close(done)));

  describe("POST /albums", () => {
    it("should create a new Album within the database", async () => {
      const res = await request(app).post("/albums").send(albumData);
      expect(res).to.be.json;
      expect(res.status).to.equal(200);
      expect(res.body.data).to.be.a("object");
      expect(res.body.data.title).to.equal(albumData.title);
      expect(res.body.data.performer).to.equal(albumData.performer);
      expect(res.body.data.cost).to.equal(albumData.cost);
    }).timeout(2000);
  });

  describe("GET /albums", () => {
    it("should return an array of all models", async () => {
      const album = new Album(albumData).save();
      const res = await request(app).get("/albums");
      expect(res.status).to.equal(200);
      expect(res).to.be.json;
      expect(res.body.data).to.be.a("array");
      expect(res.body.data.length).to.equal(1);
      expect(res.body.data[0].title).to.equal(albumData.title);
      expect(res.body.data[0].performer).to.equal(albumData.performer);
      expect(res.body.data[0].cost).to.equal(albumData.cost);
    }).timeout(2000);
  });

  describe("GET /albums/:id", () => {
    it("should return the requested model", async () => {
      await new Album(albumData).save();
      const album = await findOne(3);
      const res = await request(app).get(`/albums/${album._id}`);
      expect(res.status).to.equal(200);
      expect(res).to.be.json;
      expect(res.body.data.cost).to.equal(album.cost);
      expect(res.body.data.title).to.equal(album.title);
      expect(res.body.data.performer).to.deep.equal(album.performer);
    }).timeout(2000);
  });

  describe("PUT /albums/:id", () => {
    it("should update the properties that are passed in", async () => {
      await new Album(albumData).save();
      const album = await findOne();
      const res = await request(app)
        .put(`/albums/${album._id}`)
        .send({ performer: "Guns and Roses" });
      expect(res.status).to.equal(200);
      expect(res.body.data.title).to.equal(album.title);
      expect(res.body.data.performer).to.equal("Guns and Roses");
    }).timeout(2000);
  });

  describe("DELETE /albums/:id", () => {
    it("should delete the record and return a 204", async () => {
      await new Album(albumData).save();
      const album = await findOne();
      const res = await request(app).delete(`/albums/${album._id}`);
      expect(res.status).to.equal(204);
    }).timeout(2000);

    it("should actually remove the model from the database", async () => {
      await new Album(albumData).save();
      const album = await findOne();
      const res = await request(app).delete(`/albums/${album._id}`);
      expect(res.status).to.equal(204);
      expect(await countDocuments()).to.equal(0);
    }).timeout(2000);
  });

  describe("POST /purchases", () => {
    it("should create a new purchase and return its relations", async () => {
      const otherAlbumData = {
        title: "Sample",
        performer: "Unknown",
        cost: 2,
      };
      const album = await new Album(otherAlbumData).save();
      const user = await new User({ name: "James" }).save();
      const res = await request(app).post("/purchases").send({ user, album });
      expect(res.status).to.equal(200);
      expect(res).to.be.json;
      expect(res.body.data).to.haveOwnProperty("user");
      expect(res.body.data.user).to.haveOwnProperty("name");
      expect(res.body.data).to.haveOwnProperty("album");
      expect(res.body.data.album).to.haveOwnProperty("title");
      expect(res.body.data.user.name).to.equal(user.name);
      expect(res.body.data.album.title).to.equal(album.title);
    }).timeout(2000);
  });
});
