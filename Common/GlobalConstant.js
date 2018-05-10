const GlobalConstant = {
    mode:{
        node: 0,
        edge: 1
    },
    imagesOfProperty: 'UPLOADED_IMAGES_EQCat',
    memoOfProperty: 'MEMO_EQCat',
    defaultIcon: 'icons/default/node.svg',
    addImageIcon: 'icons/default/addImage.svg',
    labelList: [],
    propertyList: [],
    relationshipTypeList: [],
    templateList: {},
    defaultNodeStyle: function(){
        return {
            icon: 'icons/default/node.svg',
            size_property: '<id>',
            size_level: [],
            caption: '<id>'
        }
    },
    defaultEdgeStyle: function(){
        return {
            color: '#000000',
            width: {
                property: 'name',
                level: []
            }
        }
    }
}

module.exports = GlobalConstant;