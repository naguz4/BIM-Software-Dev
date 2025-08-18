import * as React from 'react';

interface Props {
    onChange: (value: string) => void
}

export function TodoSearchbox(props: Props) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', columnGap: 10, width: "100%" }}>
            <bim-text-input 
            onChange={(e) => {props.onChange(e.target.value)}}
            type="text"
            placeholder='Search todo...' 
            style={{ width: "100%", backgroundColor: "var(--background-200)"}}
            ></bim-text-input>
        </div>
    )
}