import { useState } from 'react'

const Result = ({word, coordinateTree}) => {
    
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className='result' onClick={toggleOpen}>
            <h3>{word}</h3>
            {isOpen && <p>{Array.from(coordinateTree).join(', ')}</p>}
        </div>
    )
}
    
export default Result;