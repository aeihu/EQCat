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
    defaultNodeStyle: {
        icon: 'icons/default/node.svg',
        size: {
            property: 'name',
            levels: {
                level: [
                    [0,50] //level 0: val<=0, size=50
                ],
                type: 'num'
            }
        },
        caption: '<id>'
    },
    defaultEdgeStyle: {
        color: '#000000',
        width: {
            property: 'name',
            levels: {
                level: [
                    [0,50] //level 0: val<=0, size=50
                ],
                type: 'num'
            }
        }
    }
}

module.exports = GlobalConstant;