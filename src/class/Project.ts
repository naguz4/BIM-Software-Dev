import { v4 as uuidv4} from "uuid"

export type ProjecStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {
    name: string
    description: string
    status: ProjecStatus
    userRole: UserRole
    finishDate: Date
    firstletters: string

}

export class Project implements IProject {
    //To satisfy IProject
    name: string
    description: string
    status: "pending" | "active" | "finished"
    userRole: "architect" | "engineer" | "developer"
    finishDate: Date
    firstletters: string
    color: string

    //Class internals Added comment///////

    ui: HTMLDivElement
    cost: number = 0
    progress: number = 0
    id: string

    constructor(data: IProject) {
        for (const key in data) {
            if (key === 'finishDate' && typeof data[key] === 'string') {
                this[key] = new Date(data[key]);
            } else {
                this[key] = data[key];
            }
        }
        if (!this.id)  {this.id = uuidv4()}
        this.setUI()
    }

    setUI() {

      const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];

      const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];

      if (this.ui) {return}
          this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML = `
        <div class="card-header">
                <p class="initials ${randomColorClass}">${this.firstletters}</p>
                <div>
                  <h5>${this.name}</h5>
                  <p>${this.description}</p>
                </div>
              </div>
              <div class="card-content">
                <div class="card-property">
                  <p style="color: beige;">Status</p>
                  <p>${this.status}</p>
                </div>
                <div class="card-property">
                  <p style="color: beige;">Status</p>
                  <p>${this.status}</p>
                </div>
                <div class="card-property">
                <p style="color: beige;">Role</p>
                <p>${this.userRole}</p>
              </div>
              <div class="card-property">
                <p style="color: beige;">Cost</p>
                <p>$${this.cost}</p>
              </div>
              <div class="card-property">
                <p style="color: beige;">Estimated Progress</p>
                <p>${this.progress * 100}%</p>
              </div>
              </div>
            </div>`
        }
        
}



