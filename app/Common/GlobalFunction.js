const ArrayEquals= function (arrayA, arrayB) {        
    if (typeof arrayA != 'object' || typeof arrayB != 'object'){
        console.log('ArrayEquals 1')
        return false;
    }

    if (arrayA.constructor != Array || arrayB.constructor != Array){
        console.log('ArrayEquals 2')
        return false;
    }
    
    if (arrayA.length != arrayB.length){
        console.log('ArrayEquals 3')
        return false;
    }

    for (let i = 0; i < arrayA.length; i++) {
        if (arrayA[i] != arrayB[i]) { 
            console.log('ArrayEquals 4')
            return false;  
        }      
    }    
    return true;
}

const GlobalFunction = {
    ArrayEquals: ArrayEquals,
}

module.exports = GlobalFunction;