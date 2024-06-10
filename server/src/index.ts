import express from "express";
import type { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app: Express = express();
const PORT = 3002;

const prisma = new PrismaClient();
app.use(express.json())

app.use(cors())

app.get("/allTodos", async (req: Request, res: Response) => {
  try {
    const allTodos = await prisma.todo.findMany();
    return res.json(allTodos);
  } catch (err) {
    return res.status(400).json(err);
  }
});

app.post("/createTodo", async (req: Request, res: Response) => {
  try {
    const { title, isCompleted } = req.body;
    const createTodo = await prisma.todo.create({
      data: {
        title,
        isCompleted,
      },
    });
    return res.json(createTodo);
  } catch (err) {
    return res.status(400).json(err)
  }
});

app.put("/editTodo/:id", async(req:Request, res:Response) => {
  try {
    const id = Number(req.params.id);
    const{ title, isCompleted} = req.body;
    const editTodo = await prisma.todo.update({
      where: {id},
      data: {
        title,
        isCompleted
      }
    });

    return res.json(editTodo)
    
  } catch (error) {
    return res.status(400).json(error)
  }
})

app.delete("/deleteTodo/:id", async(req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleteTodo = await prisma.todo.delete({
      where: {id},
    });
    return res.status(200).json(deleteTodo)
    
  } catch (error) {
    return res.status(400).json(error)
  }
})

app.listen(PORT, () => console.log("server is running"));
