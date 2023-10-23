const PersonForm = ({ onSubmit, name, number, nameSetter, numberSetter }) => {
    const handleInputChange = (setter) => (event) => {
        setter(event.target.value)
    }
    return (
        <form onSubmit={onSubmit}>
            <div>
                name: <input value={name} onChange={handleInputChange(nameSetter)}/>
            </div>
            <div>
                number: <input value={number} onChange={handleInputChange(numberSetter)}/> 
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm