import { useState, useEffect } from 'react'
import Head from 'next/head';
import { generateShapeWithLetters, prettifyShape, testForAllWords, testUsingSearchableDictionary } from "../scripts/challenge.js"
import Result from '../components/result'

const message = 'Running...'

const Index = () => {
    const [output, setOutput] = useState('')
    const [testingAll, setTestingAll] = useState(false)
    const [testingSearchable, setTestingSearchable] = useState(false)
    const [sizeChanging, setSizeChanging] = useState(false)
    const [startTime, setStartTime] = useState(0)
    const [size, setSize] = useState({length: 4, width: 2, height: 2})
    const [cube, setCube] = useState(generateShapeWithLetters(size))

    const testShapeWithAllWords = () => {
        setStartTime(Date.now())
        setOutput(message)
        setTestingAll(true)
    }

    const testShapeWithSearchable = () => {
        setStartTime(Date.now())
        setOutput(message)
        setTestingSearchable(true)
    }

    const reset = () => {
        setOutput('')
        setCube(generateShapeWithLetters(size))
    }

    const handleSizeChange = ({target}) => {
        setSizeChanging(true)
        if (target.value <= 0) {
            return
        }
        setSize({...size, [target.id]: parseInt(target.value)})
    }

    const prettyCube = prettifyShape(cube)

    const structureResults = (results) => {
        const styledResults = []
        results.forEach((coordinateTree, word) => {
            styledResults.push(<Result word={word} coordinateTree={coordinateTree} key={word}/>)
        })

        return (
            <>
                <p style={{whiteSpace: 'pre-line', unicodeBidi: 'embed'}}>Took {(Date.now() - startTime) / 1000} seconds to find {results.size} words in the cubey: </p>
                <div className='resultsContainer'>
                    {styledResults}
                </div>
            </>
        )
    }

    useEffect(() => {
        reset()
        setSizeChanging(false)
    }, [size])

    useEffect(() => {
        if(!testingAll) {
            return
        }

        const results = testForAllWords(cube, size)
        setOutput(structureResults(results))
        setTestingAll(false)
    }, [testingAll])

    useEffect(() => {
        if(!testingSearchable) {
            return
        }

        const results = testUsingSearchableDictionary(cube, size)
        setOutput(structureResults(results))
        setTestingSearchable(false)
    }, [testingSearchable])

    const buttonsDisabled = sizeChanging || testingSearchable || testingAll

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
                    <button disabled={buttonsDisabled} onClick={testShapeWithAllWords}><h3>Find words</h3></button>
                    <button disabled={buttonsDisabled} onClick={testShapeWithSearchable}><h3>Find words using searchable dictionary</h3></button>
                    <button disabled={buttonsDisabled} onClick={reset}><h3>Reset</h3></button>
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