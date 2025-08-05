import * as React from "react";
import { ITodo } from "../src/class/Project";

interface Props {
    todo: ITodo;
}

// Map status to CSS class
const statusClassMap: Record<string, string> = {
    pending: "pending",
    "in-progress": "in-progress",
    completed: "completed"
};

export function TodoItem(props: Props) {
    const { todo } = props;
    const statusClass = statusClassMap[todo.status] || "pending";

    return (
        <div
            className={`todo-item ${statusClass}`}
            style={{
                display: "flex",
                margin: 20,
                flexDirection: "column",
                rowGap: 10
            }}
        >
            <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                            className="material-symbols-outlined"
                            style={{
                                backgroundColor: "rgb(108, 107, 105)",
                                borderRadius: "30%",
                                width: 40,
                                height: 40,
                                textAlign: "center",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            construction
                        </span>
                        <div style={{ display: "flex", flexDirection: "row", marginLeft: 10 }}>
                            <p style={{ width: 150 }}>{todo.description}</p>
                            <p style={{ fontSize: 12 }}>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                            <div>
                                <p style={{ fontSize: 12, height: 30 }}>Priority: {todo.priority}</p>
                                <p style={{ fontSize: 12, height: 30 }}>Status: {todo.status}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
