"use client"
import Image from "next/image";
import Todo from "./component/Todo";
import useSWR from "swr";
import { TodoType } from "./types";
import { FormEvent, useRef } from "react";
import { useTodos } from "./hooks/useTodo";
import { v4 as uuidv4 } from 'uuid';
import { API_URL } from "@/constans/url";



export default function Home() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const {todos, isLoading, error, mutate} = useTodos();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/createTodo`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title: inputRef.current?.value, isCompleted: false})
    });

    if(res.ok) {
      const newTodo = res.json
      mutate([...todos, newTodo]);
      inputRef.current!.value = ""
    }
  }

  console.log(todos)

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-32 py-4 px-4">
      <div className="px-4 py-2">
        <h1 className="text-gray-800 font-bold text-2xl uppercase">
          To-Do List
        </h1>
      </div>
      <form className="w-full max-w-sm mx-auto px-4 py-2" onSubmit={handleSubmit}>
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent
      border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight
      focus:outline-none"
            type="text"
            placeholder="Add a task"
            ref={inputRef}
          />
          <button
            className="duration-150 flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200 px-4">
        {todos?.map((todo: TodoType) => (
          <Todo key={uuidv4()} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
