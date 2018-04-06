import GlobalConstant from './GlobalConstant';

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

const GetTemplate = function() {
    let xmlhttp = new XMLHttpRequest()
    
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            console.log(xmlhttp.readyState + " : " + xmlhttp.responseText);
            let __json = JSON.parse(xmlhttp.responseText);
            GlobalConstant.templateList = __json.templates;
            GlobalConstant.labelList = __json.labels;
            GlobalConstant.propertyList = __json.propertyKeys;
            GlobalConstant.relationshipTypeList = __json.relationshipTypes;
        }
    }.bind(this)

    xmlhttp.open("GET", "/template", true);
    xmlhttp.send();
}.bind(this)

const GlobalFunction = {
    ArrayEquals: ArrayEquals,
    GetTemplate: GetTemplate,
}

module.exports = GlobalFunction;