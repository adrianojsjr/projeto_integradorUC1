function Input({
    type,
    placeholder,
    onChange,
    className,
    label,
    objeto,
    campo
 
}) {
    return (
        <>
            {label && //se ele achou label, ele coloca
                (
                    <label>{label}: </label>
                )
            }
            <input type={type} placeholder={placeholder} onChange={() => onChange({...objeto, campo: e.target.value})} className={className}/>
        </>
    );
 
}
 
export { Input };