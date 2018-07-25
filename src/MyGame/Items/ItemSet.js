"use strict";

var ItemSet = [];

function ItemSet_Status() {
    var ret = "";
    var i;
    for (i = 0; i < ItemSet.length; ++i) {
        ret += ItemSet[i].statusString() + "\n";
    }
    return ret;
}

function ItemSet_addItem(name, num) {
    var idx = ItemSet_query(name);
    if (idx >= 0) {
        ItemSet[idx] += num;
    } else {
        var item = new GameItem(name);
        item.mAmount += num;
        ItemSet.push(item);
    }
}

function ItemSet_query(name) {
    var idx = -1;
    var i;
    for (i = 0; i < ItemSet.length; ++i) {
        if (ItemSet[i].mName == name) {
            idx = i;
            break;
        }
    }
    return idx;
}

function ItemSet_have(name) {
    var idx = ItemSet_query(name);
    if (idx < 0)
        return 0;
    return ItemSet[idx].mAmount;
}

// function ItemSet_Init(infoFile) {
//     var infoObj = gEngine.ResourceMap.retrieveAsset(infoFile);
//     var i;
//     for (i = 0; i < infoObj.length; ++i) {
//         ItemSet.push(new GameItem(infoObj[i]));
//     }
// }
