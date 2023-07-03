import http from "http";
import { v4 } from "uuid";
import { User } from "./model/user"
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./db";

const server = http.createServer((request, response) => {
  const { url, method } = request;

  try {
    // Get all users
    if (url === "/api/users" && method === "GET") {
      const users = getUsers();
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(users));
    }

    // Get a user by userId
    else if (url && url.startsWith("/api/users/") && method === "GET") {
      const userId = url.split("/")[3];
      if (userId) {
        const user = getUserById(userId);
        if (user) {
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify(user));
        } else {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ error: "User not found" }));
        }
      } else {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Invalid userId" }));
      }
    }

    // Create a user
    else if (url === "/api/users" && method === "POST") {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk;
      });
      request.on("end", () => {
        try {
          const { username, age, hobbies } = JSON.parse(body);
          if (!username || !age) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "Invalid body" }));
          } else {
            const newUser: User = {
              id: v4(),
              username,
              age,
              hobbies: hobbies || [],
            };
            const createdUser = createUser(newUser);
            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify(createdUser));
          }
        } catch (error) {
          response.writeHead(400, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ error: "Invalid body" }));
        }
      });
    }

    // Update an existing user
    else if (url && url.startsWith("/api/users/") && method === "PUT") {
      const userId = url.split("/")[3];
      if (userId) {
        let body = "";
        request.on("data", (chunk) => {
          body += chunk;
        });
        request.on("end", () => {
          try {
            const { username, age, hobbies } = JSON.parse(body);
            const updatedUser: User = {
              id: userId,
              username,
              age,
              hobbies: hobbies || [],
            };
            const user = updateUser(userId, updatedUser);
            if (user) {
              response.writeHead(200, { "Content-Type": "application/json" });
              response.end(JSON.stringify(user));
            } else {
              response.writeHead(404, { "Content-Type": "application/json" });
              response.end(JSON.stringify({ error: "User not found" }));
            }
          } catch (error) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "Invalid body" }));
          }
        });
      } else {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Invalid userId" }));
      }
    }

    // Delete an existing user
    else if (url && url.startsWith("/api/users/") && method === "DELETE") {
      const userId = url.split("/")[3];
      if (userId) {
        const user = deleteUser(userId);
        if (user) {
          response.writeHead(204);
          response.end();
        } else {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ error: "User not found" }));
        }
      } else {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Invalid userId" }));
      }
    } else {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Route not found" }));
    }
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Internal server error" }));
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
