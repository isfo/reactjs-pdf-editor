import { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "../Button/Button";
import Select from 'react-select';

import './styles.scss';
import { SignerPosition } from "../DraggableButton/DraggableButton";

export type Signer = {
    id: string,
    name: string,
    email: string,
    action: string,
    color?: string,
    position?: SignerPosition[]
}

type SignatarioProps = ButtonHTMLAttributes<HTMLDivElement> & {
    children?: ReactNode;
    signatario: Signer;
    onAddItem?: any,
    index: number
};

export function Signatario({
    signatario,
    index,
    children = false,
    onAddItem = null,
    ...props }: SignatarioProps) {

    const colors = ["#c56cf0", "#ffb8b8", "#ff3838", "#ff9f1a", "#fff200", "#3ae374", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#7158e2", "#17c0eb", "#3d3d3d", "#ecf0f1", "#95a5a6"];

    const options = [
        { value: 'SIGN', label: 'Assinar' },
        { value: 'APPROVE', label: 'Aprovar' },
        { value: 'RECOGNIZE', label: 'Reconhecer' },
        { value: 'SIGN_AS_A_WITNESS', label: 'Testemunhar' },
        { value: 'ACKNOWLEDGE_RECEIPT', label: 'Acusar recebimento' },
        { value: 'ENDORSE_IN_BLACK', label: 'Endossar em preto' },
        { value: 'ENDORSE_IN_WHITE', label: 'Endossar em branco' },
    ]


    function getColor(){
        console.log(signatario);
        return signatario.color ?? colors[index];
    }

    function bindCampo(event, tipo: string) {
        if (onAddItem == null)
            return;

        onAddItem(signatario.id, tipo);
    }

    const customStyles = {
        menu: (provided, state) => ({
            ...provided,
            width: state.selectProps.width,
            borderBottom: '1px dotted pink',
            color: state.selectProps.menuColor
        }),

        //placeholder
        placeholder: (_, { selectProps: { width } }) => ({
            color: '#999',
            fontSize: '1em'
        }),

        control: (_, { selectProps: { width } }) => ({
            width: width,
            display: 'flex',
            border: '1px solid #835afd',
            color: '#835afd',
            borderRadius: '8px',
            padding: 0,
            height: '30px',
            fontSize: '1em'
        }),

        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 300ms';

            return {
                ...provided,
                opacity,
                transition,
                color: '#835afd'
            };
        }
    }

    return (
        <div style={{borderLeftColor: getColor()}} className='signatario' {...props}>
            <div className="top">
                <p title={signatario.name}>
                    {signatario.name}
                </p>
                <p title={signatario.email}>
                    {signatario.email}
                </p>



            </div>

            <div className='bottom'>
                <p>Função:
                </p>
                <Select onChange={c => {signatario.action = c.value; console.log(signatario)}} placeholder="Selecione..." width="270px" styles={customStyles} options={options}  defaultValue={signatario.action} />
            </div>

            <div className="buttons">
                <Button onClick={(event) => { bindCampo(event, 'SIGNATURE') }} isOutlined={true} isSmall={true}>Assinatura</Button>
                <Button onClick={(event) => { bindCampo(event, 'NAME') }} isOutlined={true} isSmall={true}>Nome</Button>
                <Button onClick={(event) => { bindCampo(event, 'INITIALS') }} isOutlined={true} isSmall={true}>Rubrica</Button>
                <Button onClick={(event) => { bindCampo(event, 'DATE') }} isOutlined={true} isSmall={true}>CPF</Button>
                <Button onClick={(event) => { bindCampo(event, 'CPF') }} isOutlined={true} isSmall={true}>Data</Button>
            </div>


        </div>
    )
}