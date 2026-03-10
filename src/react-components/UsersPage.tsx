import React from "react";
import * as BUI from "@thatopen/ui";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "bim-grid": any;
        }
    }
}


export function UsersPage() {
    const userTable = BUI.Component.create<BUI.Table>(() => {
        const onTableCreated = (element?: Element) => {
            const table = element as BUI.Table;

            table.data = [
                {
                    data: {
                        Name: "John Doe",
                        Task: "Create work orders",
                        Role: "Project Manager",
                    }
                },
                                {
                    data: {
                        Name: "Juan",
                        Task: "Create PRs",
                        Role: "Engineer",
                    }
                },
                                {
                    data: {
                        Name: "Vishap",
                        Task: "Content",
                        Role: "Developer",
                    }
                }
            
            ]

        }
        return BUI.html `
        <bim-table ${BUI.ref(onTableCreated)}></bim-table>
        `
            
    })

    const content = BUI.Component.create<BUI.Panel>(() => {
        return BUI.html `
        <bim-panel style= "border-radius: 0px">
            <bim-panel-section label="Tasks">
                ${userTable}
            </bim-panel-section>
        </bim-panel>`
    })

    const gridLayout: BUI.Layouts = {
        primary: {
            template: `
            "header header" 40px
            "content sidebar" 1fr
            "footer footer" 40px
            / 1fr 60px
            `,
            elements: {
                header: (() => {
                    const header = document.createElement("div")
                    header.style.backgroundColor = "#8f3030ff"
                    return header
                })(),
                sidebar: (() => {
                    const sidebar = document.createElement("div");
                    sidebar.style.backgroundColor = "#8f3089ff";
                    return sidebar
                })(),
                content,
                footer: (() => {
                    const footer = document.createElement("div");
                    footer.style.backgroundColor = "#8d8f30ff";
                    return footer
                })(),
            }
        }
    }

    React.useEffect ( () => {
        BUI.Manager.init()
        const grid = document.getElementById("bimGrid") as BUI.Grid;
        grid.layouts = gridLayout;
        grid.layout = "primary";
    }, [])
    return (
        <div>
            <bim-grid id="bimGrid"></bim-grid>
        </div>
    );
}
