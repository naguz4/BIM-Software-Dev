import * as React from "react";
import { ITodo } from "../src/class/Project";

interface Props {
    todo: ITodo;
}

export function TodoItem(props: Props) {
    const { todo } = props;

    return (
        <div style={{ display: "flex", margin: 20, flexDirection: "column", rowGap: 10 }}>
            <div className="todo-item">
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
                        <div>
                            <p style={{ width: 250 }}>{todo.description}</p>
                            <p style={{ fontSize: 12 }}>{new Date(todo.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
