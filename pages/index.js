import { useState, useEffect } from 'react'
import Head from 'next/head';
import { generateShapeWithLetters, prettifyShape, testForAllWords, testUsingSearchableDictionary } from "../scripts/challenge.js"
import Result from '../components/result'

const message = 'Running...'

const Index = () => {
    const [output, setOutput] = useState('')
    const [testingAll, setTestingAll] = useState(false)
    const [testingSearchable, setTestingSearchable] = useState(false)
    const [comparing, setComparing] = useState(false)
    const [sizeChanging, setSizeChanging] = useState(false)
    const [startTime, setStartTime] = useState(0)
    const [size, setSize] = useState({length: 4, width: 4, height: 4})
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

    const compareMethods = () => {
        setStartTime(Date.now())
        setOutput(message)
        setComparing(true)
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
        const sortedResults = new Map([...results.entries()].sort())
        sortedResults.forEach((coordinateTree, word) => {
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

    const structureCompareResults = (resultsAll, resultsSearch, timeAll, timeSearch) => {
        const styledResults = []
        const sortedResultsAll = new Map([...resultsAll.entries()].sort())
        const sortedResultsSearch = new Map([...resultsSearch.entries()].sort())
        let message = `Both methods came up with ${sortedResultsAll.size} results.`

        let differences = new Map()

        const numberDifference = sortedResultsAll.size - sortedResultsSearch.size
        if (numberDifference !== 0) {
            message = `Dictionary Traverse had ${Math.abs(numberDifference)} ${numberDifference < 0 ? 'fewer' : 'more'} results than Cube Traverse`
            sortedResultsAll.forEach((result, test) => {
                if(sortedResultsSearch.has(test)) {
                    sortedResultsAll.delete(test)
                    sortedResultsSearch.delete(test)
                }
            })

            differences = sortedResultsAll.size > 0 ? sortedResultsAll : sortedResultsSearch
        }

        differences.forEach((coordinateTree, word) => {
            styledResults.push(<Result word={word} coordinateTree={coordinateTree} key={word}/>)
        })

        return (
            <>
                <p style={{whiteSpace: 'pre-line', unicodeBidi: 'embed'}}>
                    Dictionary Traverse took {timeAll} seconds
                </p>
                <p style={{whiteSpace: 'pre-line', unicodeBidi: 'embed'}}>
                    Cube Traverse took {timeSearch} seconds
                </p>
                <p style={{whiteSpace: 'pre-line', unicodeBidi: 'embed'}}>
                    {message}
                </p>
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
        if(!comparing) {
            return
        }

        const resultsAll = testForAllWords(cube, size)
        const timeAll = (Date.now() - startTime) / 1000
        setStartTime(Date.now())
        const resultsSearchable = testUsingSearchableDictionary(cube, size)
        const timeSearch = (Date.now() - startTime) / 1000

        setOutput(structureCompareResults(resultsAll, resultsSearchable, timeAll, timeSearch))
        setComparing(false)
    }, [comparing])

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
                    <button disabled={buttonsDisabled} onClick={testShapeWithAllWords}><h3>Traverse dictionary and search cube</h3></button>
                    <button disabled={buttonsDisabled} onClick={testShapeWithSearchable}><h3>Traverse cube and search dictionary</h3></button>
                    <button disabled={buttonsDisabled} onClick={compareMethods}><h3>Compare methods</h3></button>
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