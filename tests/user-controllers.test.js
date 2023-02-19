const supertest = require('supertest');
const app = require('../app');
const testAPP = supertest(app);

describe('Test for user registration flow', ()=> {
    it("Should return a bad request if email password is empty", async () => {
      const response = await testAPP.post("/api/v1/users/register").send({
        email: "abc",
        password: "",
      });

      expect(response.statusCode).toEqual(400);
      expect(response.body.msg).toBe("Bad request");
      expect(response.body.data.errors[0].msg).toBe("Invalid email");
    });
})