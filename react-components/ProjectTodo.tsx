import * as React from "react";
import { ProjectsManager } from "../src/class/ProjectManager";
import { TodoItem } from "./TodoItem";
import { updateDocument } from '../src/firebase';

interface Todo {
    description: string;
    dueDate: Date;
    status: string;
    priority: string;
}
interface Props {
    projectsManager: ProjectsManager;
    project: { id: string; name: string; todos: Todo[] };
}

export function ProjectTodo(props: Props) {
    const { project, projectsManager } = props;
    const [todos, setTodos] = React.useState(project.todos);
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [editTodo, setEditTodo] = React.useState<Partial<Todo>>({});

    // Add ToDo
    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const todoForm = document.getElementById("new-todo-form") as HTMLFormElement;
        const formData = new FormData(todoForm);
        const description = formData.get("description") as string;
        const dueDateValue = formData.get("dueDate") as string;
        const dueDate = dueDateValue ? new Date(dueDateValue) : new Date;
        const status = formData.get("status") as string;
        const priority = formData.get("priority") as string;

        projectsManager.addtodo(
            project.id,
            description,
            dueDate,
            status,
            priority
        );

        const updatedTodos = [...project.todos];
        setTodos(updatedTodos);

        try {
            await updateDocument("/projects", project.id, {
                todos: updatedTodos
            });
        } catch (err) {
            alert("Failed to update todos in Firebase!");
        }

        todoForm.reset();
        const modal = document.getElementById("new-todo-modal");
        if (modal && modal instanceof HTMLDialogElement) {
            modal.close();
        }
    };

    // Edit ToDo
    const openEditModal = (index: number) => {
        setEditIndex(index);
        setEditTodo({
            ...todos[index],
        });
        const modal = document.getElementById("edit-todo-modal");
        if (modal && modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    };

    const onEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editIndex === null) return;
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const description = formData.get("description") as string;
        const dueDateValue = formData.get("dueDate") as string;
        const dueDate = dueDateValue ? new Date(dueDateValue) : new Date();
        const status = formData.get("status") as string;
        const priority = formData.get("priority") as string;

        const updatedTodos = todos.map((todo, idx) =>
            idx === editIndex
                ? { description, dueDate, status, priority }
                : todo
        );
        setTodos(updatedTodos);

        try {
            await updateDocument("/projects", project.id, {
                todos: updatedTodos
            });
        } catch (err) {
            alert("Failed to update todos in Firebase!");
        }

        setEditIndex(null);
        setEditTodo({});
        const modal = document.getElementById("edit-todo-modal");
        if (modal && modal instanceof HTMLDialogElement) {
            modal.close();
        }
    };

    return (
        <div>
            <h4>To-Do</h4>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: 20 }}>
                <span className="material-symbols-outlined">search</span>
                <input style={{ width: "250px" }} type="text" placeholder="Search To-Do" />
                <button
                    onClick={() => {
                        const modal = document.getElementById("new-todo-modal");
                        if (modal && modal instanceof HTMLDialogElement) {
                            modal.showModal();
                        }
                    }}
                    className="material-symbols-outlined add"
                >
                    add
                </button>
            </div>

            <div style={{ display: "flex", margin: 20, flexDirection: "column", rowGap: 10 }}>
                {(todos ?? []).map((todo, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <TodoItem todo={todo} />
                        <button onClick={() => openEditModal(index)} style={{ marginLeft: 8 }}>Edit</button>
                    </div>
                ))}
            </div>

            {/* Add ToDo Modal */}
            <dialog id="new-todo-modal">
                <form id="new-todo-form" onSubmit={onFormSubmit}>
                    <label htmlFor="description">Description:</label>
                    <textarea style={{ width: 420 }} name="description" required={true} defaultValue={""} />
                    <label htmlFor="dueDate">Due Date:</label>
                    <input type="date" name="dueDate" required={true} />
                    <label htmlFor="priority">Priority:</label>
                    <select name="priority" required={true}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <label htmlFor="status">Status:</label>
                    <select name="status" required={true}>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <div>
                        <button type="submit">Add ToDo</button>
                        <button
                            type="button"
                            onClick={() => {
                                const modal = document.getElementById("new-todo-modal");
                                if (modal && modal instanceof HTMLDialogElement) {
                                    modal.close();
                                }
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </dialog>

            {/* Edit ToDo Modal */}
            <dialog id="edit-todo-modal">
                <form id="edit-todo-form" onSubmit={onEditFormSubmit}>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        style={{ width: 420 }}
                        name="description"
                        required={true}
                        defaultValue={editTodo.description || ""}
                    />
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="date"
                        name="dueDate"
                        required={true}
                        defaultValue={editTodo.dueDate ? String(editTodo.dueDate).split("T")[0] : ""}
                    />
                    <label htmlFor="priority">Priority:</label>
                    <select name="priority" required={true} defaultValue={editTodo.priority || "low"}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <label htmlFor="status">Status:</label>
                    <select name="status" required={true} defaultValue={editTodo.status || "pending"}>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <div>
                        <button type="submit">Save</button>
                        <button
                            type="button"
                            onClick={() => {
                                const modal = document.getElementById("edit-todo-modal");
                                if (modal && modal instanceof HTMLDialogElement) {
                                    modal.close();
                                }
                                setEditIndex(null);
                                setEditTodo({});
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
}
