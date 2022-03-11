import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './styles.scss';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from '../Components/Button/Button';
import { DraggableButton, SignerPosition } from '../Components/DraggableButton/DraggableButton';
import { Document, Page, pdfjs } from "react-pdf";
import { Signatario, Signer } from '../Components/Signatario/Signatario';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export function Editor() {

    const [corDisponivel, setCorDisponivel] = useState([]);
    const [novoCampo, setNovoCampo] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [signatarios, setSignatarios] = useState([] as Signer[]);
    const [tipoAtual, setTipoAtual] = useState('');
    const [signatarioAtual, setSignatarioAtual] = useState({} as Signer);

    const [loaded, setLoaded] = useState(false);


    if (corDisponivel.length == 0) {

        let colors = ["#c56cf0", "#ffb8b8", "#ff3838", "#ff9f1a", "#fff200", "#3ae374", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#7158e2", "#17c0eb", "#3d3d3d", "#ecf0f1", "#95a5a6"];

        colors.forEach(el => {
            corDisponivel.push(
                {
                    id: corDisponivel.length,
                    color: el
                }
            );
            setCorDisponivel(corDisponivel);
        })

        setCorDisponivel(colors);
    }

    if (signatarios.length == 0) {
        setSignatarios([
            {
                id: uuidv4(),
                name: 'Itallo Fidelis',
                email: 'itallosfo@gmail.com',
                action: 'SIGN',
                color: corDisponivel[0].color,
                position: []
            },
            {
                id: uuidv4(),
                name: 'Karla Lima Vargens',
                email: 'karla_lima03@hotmail.com',
                action: 'APPROVE',
                color: corDisponivel[1].color,
                position: []
            }
        ]);

        corDisponivel.shift();
        corDisponivel.shift();
        setCorDisponivel(corDisponivel);
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);

        setLoaded(true);
    }

    function changePage(offset) {
        if (pageNumber + offset < 1 || pageNumber + offset > numPages)
            return;

        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function addCampo(signatarioId, tipoCampo) {
        //console.log(signatarioId, tipoCampo);
        setSignatarioAtual(signatarios.filter(sig => {
            return sig.id == signatarioId
        })[0])
        setTipoAtual(tipoCampo);
        setNovoCampo(true);
    }

    function addCampoPage(e) {
        if (!novoCampo)
            return;

        //console.log('addCampoPage', e)


        signatarios.forEach(element => {
            if (element.id == signatarioAtual.id) {
                element.position.push({
                    id: uuidv4(),
                    x: e.clientX,
                    y: e.clientY,
                    z: pageNumber,
                    element: tipoAtual
                })
            }
        });

        console.log(signatarios);

        setSignatarios(signatarios);


        CancelarOverlay();
    }

    function AtualizarPosicao(position, sigId) {
        // console.log('Atualizar posição', e);

        signatarios.forEach(element => {
            if (element.id == sigId) {
                element.position.forEach(pos => {
                    if (pos.id == position.id) {
                        pos = position;
                    }
                })
            }
        });
    }

    function CancelarOverlay() {
        setNovoCampo(false);
        setSignatarioAtual(null);
        setTipoAtual(null)
    }

    const reorder = (list, startIndex, endIndex): Signer[] => {
        const result = list;
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const quotes = reorder(
            signatarios,
            result.source.index,
            result.destination.index
        );

        setSignatarios(quotes);
    }


    return (
        <div className="all">
            <div onClick={CancelarOverlay} className={novoCampo ? 'overlay' : ''}></div>

            <div className="painelLateral">
                <DragDropContext onDragEnd={onDragEnd} >
                    <Droppable droppableId="list">
                        {provided => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {
                                    signatarios.map((el, index) =>
                                    (
                                        <Draggable key={el.id} draggableId={el.id} index={index}>
                                            {provided => (
                                                <div key={el.id} ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <Signatario
                                                        key={el.id}
                                                        signatario={el}
                                                        index={index}
                                                        onAddItem={addCampo}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                    )
                                }
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            {
                signatarios.map((el) => {

                    return (

                        el.position
                            .filter(sigp => { return sigp.z == pageNumber })
                            .map(elpos => {
                                return (
                                    <DraggableButton
                                        onMoved={AtualizarPosicao}
                                        key={elpos.id}
                                        sigID={el.id}
                                        posID={elpos.id}
                                        color={el.color}
                                        tipo={tipoAtual}
                                        position={elpos}
                                        page={pageNumber}
                                    />
                                )
                            })

                    )

                })
            }


            <div className="documento">

                <Document onLoadError={console.error}
                    file={{ url: "https://wakke-drive.s3.sa-east-1.amazonaws.com/Samples/sample.pdf " }}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <>

                        <Page onClick={addCampoPage} pageNumber={pageNumber} />
                    </>

                </Document>

                <div className="paginator">
                    <Button onClick={previousPage}>&lt;</Button>
                    <p>{pageNumber} de {numPages}</p>
                    <Button onClick={nextPage} isSmall>&gt;</Button>
                </div>

            </div>

        </div>
    )
};