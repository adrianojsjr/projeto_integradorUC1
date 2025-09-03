import { useState } from "react";
import { Spinner } from 'react-bootstrap';

function Form({
    onSubmit,
    func,
    className,
    titulo,
    children

}) {

    //botão que fica carregando
    const [loading, setLoading] = useState(false);

    async function send(params) {
        setLoading(true)
        var any = await func()
        setLoading(false)
        return any
    }


    return (
        <div className="formulario">
            <h3>{titulo}</h3>
            <form onSubmit={(e) => e.preventDefault()}>

                {children}

                <button type="submit" className={className} onClick={() => send()} disabled={loading}>
                    {loading? (
                        <Spinner animation='border' role="status">
                            <span className="visually-hidden">
                                Cadastrando...
                            </span>
                        </Spinner>
                    ):(
                    <>Cadastrar</>
            )}
                </button>
            </form>
        </div>
    )
}

export { Form };