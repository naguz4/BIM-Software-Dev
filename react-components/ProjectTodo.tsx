import * as React from "react";
import { ProjectsManager } from "../src/class/ProjectManager";
import { TodoItem } from "./TodoItem";

interface Props {
    projectsManager: ProjectsManager;
    project: { id: string; name: string; todos: { description: string; dueDate: string; status: string }[] };
}

export function ProjectTodo(props: Props) {
    const { project, projectsManager } = props;
    const [todos, setTodos] = React.useState(project.todos);

    const onFormSubmit = (e: React.FormEvent) => {
        const todoForm = document.getElementById("new-todo-form");
        if (!(todoForm && todoForm instanceof HTMLFormElement)) {
            return;
        }
        e.preventDefault();
        const formData = new FormData(todoForm);
        const description = formData.get("description") as string;
        const dueDateValue = formData.get("dueDate") as string;
        const dueDate = dueDateValue ? new Date(dueDateValue) : new Date();
        const status = formData.get("status") as string;

        // Add the new ToDo
        projectsManager.addtodo(project.id, description, dueDate, status);

        // Update the state to re-render the ToDo list
        setTodos([...project.todos]);

        // Reset the form and close the modal
        todoForm.reset();
        const modal = document.getElementById("new-todo-modal");
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
                {(project.todos ?? []).map((todo, index) => (
                    <TodoItem key={index} todo={todo} />
                ))}
            </div>

            <dialog id="new-todo-modal">
                <form id="new-todo-form" onSubmit={(e) => onFormSubmit(e)}>
                    <label htmlFor="description">Description:</label>
                    <textarea style={{ width: 420 }} name="description" required={true} defaultValue={""} />
                    <label htmlFor="dueDate">Due Date:</label>
                    <input type="date" name="dueDate" required={true} />
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
        </div>
    );
}
