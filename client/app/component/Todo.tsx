import React, { useState } from "react";
import { TodoType } from "../types";
import useSWR from "swr";
import { useTodos } from "../hooks/useTodo";
import { API_URL } from "@/constans/url";

type TodoProps = {
  todo: TodoType;
}



const Todo = ({todo}: TodoProps) => {
  const [isEdit, setEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle]  = useState<string>(todo.title)
  const {todos, isLoading, error, mutate} = useTodos();

  
  const handleEdit = async () => {
    setEditTitle(todo.title)
    setEdit(!isEdit);
    if(isEdit) {
      const res = await fetch(`${API_URL}/editTodo/${todo.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title: editTitle,
        })
      })
      if(res.ok) {
        const editTodo = await res.json();
        mutate([...todos, editTodo]);
      }
    }
  }


  const handleDelete = async (id: number) => {
    const res = await fetch(`${API_URL}/deleteTodo/${todo.id}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
    })
    if(res.ok) {
      const updatedTodos = todos.filter((todo:TodoType) => todo.id !== id)
      mutate([updatedTodos])
    }
  }

  const handleToggle = async(id:number, isCompleted:boolean) => {
    const res = await fetch(`${API_URL}/editTodo/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({isCompleted: !isCompleted})
    })

    if(res.ok) {
      const editTodo = res.json();
      mutate([...todos, editTodo])
    }
  }

  return (
    <li className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="todo1"
            name="todo1"
            type="checkbox"
            checked={todo.isCompleted}
            readOnly
            className="h-4 w-4 text-teal-600 focus:ring-teal-500
            border-gray-300 rounded"
            onChange={() => handleToggle(todo.id, todo.isCompleted)}
          />
          <label className="ml-3 block text-gray-900">
            {isEdit ? (<input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border rounded py-1 px-2"/>) : (<span className={`text-lg font-medium mr-2 ${todo.isCompleted ? "line-through" : ""}`}>{todo.title}</span>)}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <button className="duration-150 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-2 rounded" onClick={handleEdit}>
            {isEdit ? "save": "✒"}
            
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded" onClick={() => handleDelete(todo.id)}>
            ✖
          </button>
        </div>
      </div>
    </li>
  );
};

export default Todo;
