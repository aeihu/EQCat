import GlobalVariable from './GlobalVariable';

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
            let __json = JSON.parse(Base64.decode(xmlhttp.responseText));
            if (__json.hasOwnProperty('error')){
                console.log(__json.message);
            }else{
                GlobalVariable.templateList = __json.templates;
                GlobalVariable.labelList = __json.labels;
                GlobalVariable.propertyList = __json.propertyKeys;
                GlobalVariable.relationshipTypeList = __json.relationshipTypes;
            }
        }
    }.bind(this)

    xmlhttp.open("GET", "/template", true);
    xmlhttp.send();
}.bind(this)

const MathAngle = function (x1, y1, x2, y2)
{
    let __result;
    let __xx, __yy;

    __xx = x2 - x1;
    __yy = y2 - y1;

    if (__xx == 0.0){
        __result = Math.PI / 2.0;
    }else{
        __result = Math.atan(Math.abs(__yy / __xx));
    }

    if ((__xx < 0.0) && (__yy >= 0.0)){
        __result = Math.PI - __result;
    }else if ((__xx < 0.0) && (__yy < 0.0)){
        __result = Math.PI + __result;
    }else if ((__xx >= 0.0) && (__yy < 0.0)){
        __result = Math.PI * 2.0 - __result;
    }

    return __result;
}

const CheckName = function (str){
    if (str == ''){
        return "It can't empty";
    }
    
    //!@#%^&*()-=+{}[];:'"\|,.<>?/~`
    let __tmp = ' !@#%^&*()-=+{}[];:"\|,.<>?/~`' + "'";
    for (let i=0; i<__tmp.length; i++){
        if (str.indexOf(__tmp[i]) >= 0){
            return "It's invalid string";
        }
    }

    __tmp = '0123456789';
    for (let i=0; i<__tmp.length; i++){
        if (str[0] == __tmp[i]){
            return "It's invalid string";
        }
    }

    return '';
}

const SendAjax = function(onSuccess, onError, url, parameter){
    let __xmlhttp = new XMLHttpRequest()
    let __url = typeof parameter === 'undefined' ? url : url + Base64.encodeURI(JSON.stringify(parameter));
    console.log(parameter)
    console.log(__url)
    __xmlhttp.onreadystatechange = function(){
        if (__xmlhttp.readyState==4 && __xmlhttp.status==200){
            let __json = JSON.parse(Base64.decode(__xmlhttp.responseText));
            if (__json.hasOwnProperty('error')){
                if (typeof onError == 'function'){
                    onError(__json);
                }
            }else{
                if (typeof onSuccess == 'function'){
                    onSuccess(__json);
                }
            }
        }
    }

    __xmlhttp.open("GET", __url, true);
    __xmlhttp.send();
}

const GlobalFunction = {
    ArrayEquals: ArrayEquals,
    GetTemplate: GetTemplate,
    MathAngle: MathAngle,
    CheckName: CheckName,
    SendAjax: SendAjax,
}

module.exports = GlobalFunction;