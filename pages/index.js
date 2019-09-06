import { useState, useEffect } from 'react'
import Head from 'next/head';
import challenge, { generateShapeWithLetters, prettifyShape } from "../scripts/challenge.js"
import Result from '../components/result'

let start
const message = 'Running...'

const Index = () => {
    const [output, setOutput] = useState('')
    const [size, setSize] = useState({length: 4, width: 4, height: 4})
    const [cube, setCube] = useState(generateShapeWithLetters(size))

    const testShape = () => {
        start = Date.now()
        setOutput(message)
    }

    const reset = () => {
        setOutput('')
        setCube(generateShapeWithLetters(size))
    }

    const handleSizeChange = ({target}) => {
        console.log({...size, [target.id]: parseInt(target.value)})
        setSize({...size, [target.id]: parseInt(target.value)})
    }

    useEffect(() => {
        reset()
    }, [size])

    useEffect(() => {
        if (output !== message) {
            return
        }

        const result = challenge(cube)
        const styledResults = []
        result.forEach((coordinateTree, word) => {
            styledResults.push(<Result word={word} coordinateTree={coordinateTree} key={word}/>)
        })
        setOutput(
            <>
                <p style={{whiteSpace: 'pre-line', unicodeBidi: 'embed'}}>Took {(Date.now() - start) / 1000} seconds to find {result.size} words in the cubey: </p>
                <div className='resultsContainer'>
                    {styledResults}
                </div>
            </>
        )
    }, [output, cube])

    const prettyCube = prettifyShape(cube)

    return (
        <main>
            <Head>
                <title>Cubey Challenge</title>
                <link href="../static/main.css" rel="stylesheet" />
            </Head>
            <section>
                <article>
                    <h1>Controls</h1>
                    <form>
                        <label htmlFor='length'>Length: <input type='number' id='length' value={size.length} onChange={handleSizeChange}></input></label>
                        <label htmlFor='width'>Width: <input type='number' id='width' value={size.width} onChange={handleSizeChange}></input></label>
                        <label htmlFor='height'>Height: <input type='number' id='height' value={size.height} onChange={handleSizeChange}></input></label>
                    </form>
                    <button onClick={testShape}><h3>Find words</h3></button>
                    <button onClick={reset}><h3>Reset</h3></button>
                </article>
                <article>
                    <h1>Our Shape</h1>
                    <p style={{whiteSpace: 'pre-line', unicodeBidi: 'embed'}}>{prettyCube}</p>
                </article>
            </section>
            <aside>
                <div className='capsule'>
                    <h1>Output:</h1>
                    { output }
                </div>
            </aside>
        </main>
    )
}
    
export default Index;