const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4"); 

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

function validateUrlGit(request, response, next) {
  const { url } = request.body;

  const gitUrl = "https://github.com";

  if (gitUrl !== `${url.split("/")[0]}//${url.split("/")[2]}`) {
    return response.status(400).json({ error: "Invalid project URL" });
  }

  return next();
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID" });
  }

  return next();
}

app.use("/repositories/:id", validateProjectId);

app.get("/repositories", (request, response) => {
   

  return response.json(repositories);
});

app.post("/repositories", validateUrlGit, (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid(); 
  const repositorie = { id, title, url, techs, likes: 0 }; 

  repositories.push(repositorie); 

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
 
  const likes = repositories.find((repositorie) => repositorie.id === id).likes;

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
 
 

  repositories.splice(repositorieIndex, 1); 

  return response.status(204).send();
});

 

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repositorieIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }


  let newRepo = repositories.find(x => x.id === id);
 
  const repositorie = {
    ...newRepo,
    likes: newRepo.likes + 1
  };

  repositories[repositorieIndex] = repositorie; 

  return response.json(repositorie);
});

module.exports = app;
