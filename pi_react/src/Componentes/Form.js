import { useState } from 'react';
import Button from 'react-bootstrap/Button';

function Form({
    onSubmit,
    func,
    title,
    children
}) {
    const [loading, setLoading] = useState(false);
    

    async function send() {
        setLoading (true)
        var any = await func()
        setLoading(false)
        return any
        
    }



    return (
        <div className='cardForm'>
            <h3>{title}</h3>
            <form onSubmit={(e)=> e.preventDefault()}>
                {children}
                
               
                <button onClick={() => send()}> Salvar </button>
            </form>
        </div>
    )

}

export { Form }