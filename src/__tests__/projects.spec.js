const request = require("supertest");
const app = require("../app");
const { isUuid } = require("uuidv4");

describe("Projects", () => {
  it("should be able to create a new repository", async () => {
    const response = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"],
      });

    expect(isUuid(response.body.data.id)).toBe(true);

    expect(response.body).toMatchObject({
      data: {
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"],
        likes: 0,
      },
      success: true,
    });
  });

  it("should be able to list the projects", async () => {
    const repository = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"],
      });

    const response = await request(app).get("/repositories");

    expect(response.body.data).toEqual(
      expect.arrayContaining([
        {
          id: repository.body.data.id,
          url: "https://github.com/Rocketseat/umbriel",
          title: "Umbriel",
          techs: ["Node", "Express", "TypeScript"],
          likes: 0,
        },
      ])
    );
  });

  it("should be able to update repository", async () => {
    const repository = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"],
      });

    const response = await request(app)
      .put(`/repositories/${repository.body.data.id}`)
      .send({
        url: "https://github.com/Rocketseat/unform",
        title: "Unform",
        techs: ["React", "ReactNative", "TypeScript", "ContextApi"],
      });

    expect(isUuid(response.body.data.id)).toBe(true);

    expect(response.body).toMatchObject({
      data: {
        url: "https://github.com/Rocketseat/unform",
        title: "Unform",
        techs: ["React", "ReactNative", "TypeScript", "ContextApi"],
      },
      success: true,
    });
  });

  it("should not be able to update a repository that does not exist", async () => {
    await request(app).put(`/repositories/123`).expect(400);
  });

  it("should not be able to update repository likes manually", async () => {
    const repository = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["React", "ReactNative", "TypeScript", "ContextApi"],
      });

    const response = await request(app)
      .put(`/repositories/${repository.body.data.id}`)
      .send({
        likes: 15,
      });

    expect(response.body).toMatchObject({
      error: "Validation failed",
      success: false,
    });
  });

  it("should be able to delete the repository", async () => {
    const response = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/Rocketseat/umbriel",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"],
      });

    await request(app)
      .delete(`/repositories/${response.body.data.id}`)
      .expect(204);

    const repositories = await request(app).get("/repositories");

    const repository = repositories.body.data.find(
      (r) => r.id === response.body.data.id
    );

    expect(repository).toBe(undefined);
  });

  it("should not be able to delete a repository that does not exist", async () => {
    await request(app).delete(`/repositories/123`).expect(400);
  });
});
