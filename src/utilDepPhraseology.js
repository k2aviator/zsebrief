export const depPhraseology = (departureType, departureName, departureNum, departureTopAlt) => {
    //console.log("function inputs are ", departureType, departureName, departureNum, departureTopAlt)
    let returnArray = []
    let phrase = ""
    if (departureType === "R/V"){
        phrase = `...via the ${departureName} ${departureNum} departure, radar vectors to {FIX}, then as filed... `
    } else if (departureType === "RNAV"){
        phrase = `...via the ${departureName} ${departureNum} departure`
    } else if (departureType === "ODP_NAMED"){
        phrase = `...via the ${departureName} ${departureNum} departure`
    } else if (departureType === "ODP_NOT_NAMED"){
        phrase = `Depart via the (airport name) (runway number) departure procedure`
    } else if (departureType === "RADIAL-TRANS"){
        phrase = `...via the ${departureName} ${departureNum} departure`
    } else if (departureType === "R/V_NO_DEP"){
        phrase = `...via radar vectors to {FIX}, then as filed...`
    }
    
    returnArray.push(phrase)

    departureTopAlt = String(departureTopAlt)
    let climbPhrase = ""
    if (departureTopAlt.includes("DON'T")){
        climbPhrase = `---`
    } else {
        climbPhrase = departureTopAlt
    }

    returnArray.push(climbPhrase)

    // console.log("return array is ", returnArray)
    return returnArray
}
