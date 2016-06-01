import Router from 'koa-router';
import uuid from 'uuid';
import faker from 'faker';


class FakeDB {
  constructor(numberOfTodos) {
    this.todos = this.generateTodos(numberOfTodos)
  }

  generateTodos (numberOfTodos = 5) {
    return new Array(numberOfTodos).fill(0).map(t => {
      return {
        id: uuid.v4(),
        text: faker.lorem.words(5),
        completed: false,
      }
    })
  }

  getAll () {
    return new Promise(resolve => {
      resolve(this.todos);
    });
  }

  insert ({ text, completed }) {
    return new Promise(resolve => {
      this.todos = this.todos.concat({
        id: uuid.v4(),
        text,
        completed,
      });
      resolve({ rowsInserted: 1, success: true });
    });
  }
}

const db = new FakeDB(5);

const apiRouter = new Router({
  prefix: '/api/v1'
});

apiRouter.get('/todos', async (ctx) => {
  try {
    const response = await db.getAll();
    ctx.status = 200;
    ctx.body = { data: response };
  } catch (e) {
    ctx.status = 404;
    ctx.body = { message: 'error', status: 404, error: e };
  }
});

apiRouter.post('/todos', async (ctx) => {
  try {
    const todoToInsert = ctx.request.body;
    const response = await db.insert(todoToInsert);
    ctx.status = 200;
    ctx.body = { data: response };
  } catch (e) {
    ctx.status = 404;
    ctx.body = { message: 'error', status: 404, error: e };
  }
});

export default apiRouter;