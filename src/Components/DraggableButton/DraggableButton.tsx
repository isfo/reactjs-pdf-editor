import React from "react";
import { ButtonHTMLAttributes } from "react";
import ReactDOM from "react-dom";
import Draggable, { DraggableProps, DraggableEventHandler } from "react-draggable";


import './styles.scss';


type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    page: number;
    position: SignerPosition,
    onMoved: any,
    sigID: string,
    posID: string,
    tipo: string
};
// ({ isOutlined = false, ...props }: ButtonProps)

export type SignerPosition = {
    id: string,
    x: number,
    y: number,
    z: number,
    element: string,
}

type Bounds = {
    left: number,
    top: number,
    right: number,
    bottom: number
}
export function DraggableButton({ onMoved, page = 0, position, color, sigID, ...props }: ButtonProps) {

    function bindEvent(evento) {
        evento();
    }

    page = page == 0 ? 1 : page;


    let bounds: Bounds;
    let reff: any;

    bounds = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };

    function handleStart(a, b) {
        //console.log('1');

        var n = document.querySelector('[data-page-number="' + page + '"]') as HTMLElement;

        var style = window.getComputedStyle(n);
        var mtop = Number(style.marginTop.replace('px', '')) / 2;

        bounds.left = n ? n.offsetLeft : 0;
        bounds.top = n.offsetTop;
        bounds.right = n.offsetLeft + n.offsetWidth - a.target.offsetWidth;
        bounds.bottom = n.offsetTop + n.offsetHeight - a.target.offsetHeight;

        //console.log(n.offsetTop, bounds);

    }
    function handleDrag() {
        //console.log('2');

    }
    function handleStop(e, data) {
        console.log('3', data);
        position.x = data.x;
        position.y = data.y;
        onMoved(position, sigID);

    }

    function GetTipo() {

        switch (position.element) {
            case 'SIGNATURE':
                return 'Assinatura';
            case 'NAME':
                return 'Nome';
            case 'INITIALS':
                return 'Rubrica';
            case 'DATE':
                return 'Data';
            case 'CPF':
                return 'CPF';
        }
    }

    return (

        <Draggable

            axis="both"
            handle=".drag"
            defaultPosition={position}
            position={null}
            grid={[1, 1]}
            scale={1}
            bounds={bounds}
            onStart={handleStart}
            onDrag={handleDrag}
            onStop={handleStop}>


            <div className='drag' style={{'backgroundColor':color ?? 'red'}}>
                {GetTipo()}
            </div>


        </Draggable>
    )




    // <button
    //             className={`button ${isOutlined ? 'outlined' : ''}`}
    //             {...props} />
}

