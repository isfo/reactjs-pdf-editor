import { ButtonHTMLAttributes } from "react";


import './styles.scss';


type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
    isSmall?: boolean
};

export function Button({ isOutlined = false, isSmall = false, ...props }: ButtonProps) {

    return (
        <button
            className={`handle button ${isOutlined ? 'outlined' : ''} ${isSmall ? 'small' : ''}`}
            {...props} />
    )
}