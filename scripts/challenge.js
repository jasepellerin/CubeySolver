import dictionary from "../static/dictionary.json";

const allSiblings = {}

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
const getSiblings = (x, y, z) => {
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
const generateSiblingMap = (shape) => {
    const map = {}

    shape.forEach((slice, xIndex) => {
        slice.forEach((row, yIndex) => {
            row.forEach((letter, zIndex) => {
                map[`(${xIndex}, ${yIndex}, ${zIndex})`] = {value: letter, siblings: getSiblings(xIndex, yIndex, zIndex)}
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

const testForAllWords = (cubey) => {
    const cubeMap = generateSiblingMap(cubey)
    const result = new Map()
    dictionary.forEach(word => {
        const searchResult = testShapeForWord(cubeMap, word)
        if (searchResult) {
            result.set(word, searchResult)
        }
    })
    return result
}

export { testForAllWords as default, prettifyShape, generateShapeWithLetters }
