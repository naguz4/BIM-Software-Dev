import { v4 as uuidv4 } from "uuid";

export type ProjecStatus = "pending" | "active" | "finished";
export type UserRole = "architect" | "engineer" | "developer";

export interface IProject {
    name: string;
    description: string;
    status: ProjecStatus;
    userRole: UserRole;
    finishDate: Date;
    firstletters: string;
    todos: ITodo[]; // Include todos in the IProject interface
}

export interface ITodo {
    description: string;
    dueDate: string;
    status: string; // Add status field
}

export class Project implements IProject {
    name: string;
    description: string;
    status: ProjecStatus;
    userRole: UserRole;
    finishDate: Date;
    firstletters: string;
    todos: ITodo[] = [];
    color: string;

    cost: number = 0;
    progress: number = 0;
    id: string;

    constructor(data: IProject) {
        for (const key in data) {
            if (key === 'finishDate' && typeof data[key] === 'string') {
                this[key] = new Date(data[key]);
            } else if (key === 'todos' && Array.isArray(data[key])) {
                this[key] = Array.from(data[key]); // Ensure todos is a new array instance
            } else {
                this[key] = data[key];
            }
        }
        if (!this.id) {
            this.id = uuidv4();
        }
        this.todos = data.todos;
    }

}



