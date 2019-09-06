import dictionary from "../static/dictionary.json";

const allSiblings = {}

// Create a multi-level array showing each character's use number in each position
const generateSearchableDictionary = () => {
    const searchableDictionary = {}
    dictionary.forEach(word => {
        const characters = word.toLowerCase().split('')
        let dictionaryPointer = ''
        for(let i = 0; i < word.length; i++) {
            dictionaryPointer = `${dictionaryPointer}[${characters[i]}]`
            searchableDictionary[dictionaryPointer] ? searchableDictionary[dictionaryPointer] += 1 : searchableDictionary[dictionaryPointer] = 1
        }
    })

    return searchableDictionary
}

// Select a random lowercase letter
const generateRandomLetter = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    return characters.split('')[Math.floor(Math.random() * characters.length)]
}

// Make a multidimensional array of shape Array[length]Array[width]Array[height]
const generateShape = (fillFunction = () => 'x', length, width, height) => (
    [...Array(length).keys()].map(() => (
        [...Array(width).keys()].map(() => (
            [...Array(height).keys()].map(fillFunction)
        ))
    ))
)

// Fill shape with random letters
const generateShapeWithLetters = ({length, width, height}) => (
    generateShape(generateRandomLetter, length, width, height)
)

// Make a nicer shape string
const prettifyShape = (shape) => {
    let shapeString = ``
    shape.forEach(slice => {
        slice.forEach(row => {
            row.forEach(letter => {
                shapeString += letter
            })
            shapeString += `\n`
        })
        shapeString += `\n`
    })
    return shapeString
}

// Which ways do we have neighbors
const getPossibleCoordinateValuesAlongDimension = (coordinate, dimension) => {
    const possibleCoordinateValues = [coordinate]
    coordinate != 0 && possibleCoordinateValues.push(coordinate -1)
    coordinate != dimension - 1 && possibleCoordinateValues.push(coordinate + 1)
    return possibleCoordinateValues
}

// Get an array of sibling coordinates
const getSiblings = (x, y, z, { length, width, height }) => {
    // Not in cube
    if (x < 0 || x >= length || y < 0 || y >= width || z < 0 || z >= height) {
        return []
    }
    
    // Memoize
    const key = `${x}, ${y}, ${z}`

    if (allSiblings[key]) {
        return allSiblings[key]
    }

    const siblings = []

    getPossibleCoordinateValuesAlongDimension(x, length).forEach(xValue => {
        getPossibleCoordinateValuesAlongDimension(y, width).forEach(yValue => {
            getPossibleCoordinateValuesAlongDimension(z, height).forEach(zValue => {
                // Ignore current point
                if (xValue === x && yValue === y && zValue === z) {
                    return
                }
                
                siblings.push([xValue, yValue, zValue])
            })
        })
    })

    allSiblings[key] = siblings

    return siblings
}

// Generate a map from every coordinate to every sibling coordinate
const generateSiblingMap = (shape, size) => {
    const map = {}

    shape.forEach((slice, xIndex) => {
        slice.forEach((row, yIndex) => {
            row.forEach((letter, zIndex) => {
                map[`(${xIndex}, ${yIndex}, ${zIndex})`] = {value: letter, siblings: getSiblings(xIndex, yIndex, zIndex, size)}
            })
        })
    })

    return map
}

// Test a specific coordinate to see if it matches the word
const testCoordinateForWord = (shapeMap, coordinate, word, currentWord = '', usedCoordinates) => {
    if(usedCoordinates.has(coordinate)) {
        return false
    }

    currentWord += shapeMap[coordinate].value

    // This coordinate does not work
    if (word.search(currentWord) === -1) {
        return false
    }

    usedCoordinates.add(coordinate)
    
    // Word found
    if (currentWord === word) {
        return usedCoordinates
    }
    
    return Object.keys(shapeMap).some(coordinate => testCoordinateForWord(shapeMap, coordinate, word, currentWord, usedCoordinates))
}

// Search for word in entire cube
const testShapeForWord = (shapeMap, word) => {
    const usedCoordinates = new Set()
    if (Object.keys(shapeMap).some(coordinate => testCoordinateForWord(shapeMap, coordinate, word, '', usedCoordinates))) {
        return usedCoordinates
    }
}

// Create or consume dictionary in localStorage
const getSearchableDictionary = () => {
    const key = 'dictionary'
    let dictionary = JSON.parse(localStorage.getItem(key));
    if (!dictionary) {
        dictionary = generateSearchableDictionary()
        localStorage.setItem(key, JSON.stringify(dictionary))
    }

    return dictionary
}

// Get results by searching down the dictionary and seeing if the letters are in the cube
const traverseSearchableDictionary = (siblingMap, searchableDictionary, results) => {
    console.log(siblingMap)
}

// Search for all dictionary words in the cube, returning results objects for each
const testForAllWords = (cubey, size) => {
    const cubeMap = generateSiblingMap(cubey, size)
    const results = new Map()
    dictionary.forEach(word => {
        const searchResult = testShapeForWord(cubeMap, word)
        if (searchResult) {
            results.set(word, searchResult)
        }
    })
    return results
}

// Get results by searching down the dictionary and seeing if the letters are in the cube
const testUsingSearchableDictionary = (cubey, size) => {
    const cubeMap = generateSiblingMap(cubey, size)
    const searchableDictionary = getSearchableDictionary()
    const results = new Map()
    return traverseSearchableDictionary(cubeMap, searchableDictionary, results)
}

export { testForAllWords, testUsingSearchableDictionary, prettifyShape, generateShapeWithLetters }
