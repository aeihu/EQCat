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

const GetLTP = function() {
    if (GlobalVariable.flagForGetLTP){
        GlobalFunction.SendAjax(
            (result)=>{
                //GlobalVariable.templateList = result.templates;
                GlobalVariable.labelList = result.labels;
                GlobalVariable.propertyList = result.propertyKeys;
                GlobalVariable.relationshipTypeList = result.relationshipTypes;
                GlobalVariable.flagForGetLTP = false;
            },
            (error)=>{console.log(error.message)},
            "/template"
        );
    }
}.bind(this)

const GetTemplate = function() {
    GlobalFunction.SendAjax(
        (result)=>{
            GlobalVariable.templateList = result;
        },
        (error)=>{console.log(error.message)},
        "/getTemplate"
    );
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

const DBCounterDataToString = function(counter){
    console.log(counter)
    let __created = counter.nodesCreated > 0 ? counter.nodesCreated + ' node(s), ' : '';
    __created += counter.relationshipsCreated > 0 ? counter.nodesCreated + ' relationship(s), ' : '';
    if (__created != ''){
        __created = 'created ' + __created;
    }

    let __deleted = counter.nodesDeleted > 0 ? counter.nodesDeleted + ' node(s), ' : '';
    __deleted += counter.relationshipsDeleted > 0 ? counter.relationshipsDeleted + ' relationship(s), ' : '';
    if (__deleted != ''){
        __deleted = 'deleted ' + __deleted;
    }

    let __added = counter.labelsAdded > 0 ? counter.labelsAdded + ' label(s), ' : '';
    __added += counter.indexesAdded > 0 ? counter.indexesAdded + ' index(es), ' : '';
    __added += counter.constraintsAdded > 0 ? counter.constraintsAdded + ' constraint(s), ' : '';
    if (__added != ''){
        __added = 'added ' + __added;
    }

    let __removed = counter.labelsRemoved > 0 ? counter.labelsRemoved + ' label(s), ' : '';
    __removed += counter.indexesRemoved > 0 ? counter.indexesRemoved + ' index(es), ' : '';
    __removed += counter.constraintsRemoved > 0 ? counter.constraintsRemoved + ' constraint(s), ' : '';
    if (__removed != ''){
        __removed = 'removed ' + __removed;
    }

    let __set = counter.propertiesSet > 0 ? 'set ' + counter.propertiesSet + ' property(s), ' : '';
    return __created + __deleted + __set + __added + __removed;
}

const GlobalFunction = {
    ArrayEquals: ArrayEquals,
    GetLTP: GetLTP,
    MathAngle: MathAngle,
    CheckName: CheckName,
    SendAjax: SendAjax,
    DBCounterDataToString: DBCounterDataToString,
    GetTemplate: GetTemplate,
}

module.exports = GlobalFunction;