"use strict";

var CharacterSet = [];

function CharacterSet_Status() {
    var ret = "";
    var i;
    for (i = 0; i < CharacterSet.length; ++i) {
        ret += CharacterSet[i].statusString() + "\n";
    }
    return ret;
}

function CharacterSet_Recover() {
    var i;
    for (i = 0; i < CharacterSet.length; ++i) {
        var ch = CharacterSet[i];
        ch.mCurrentHP = ch.mMaxHP;
        ch.mCurrentVP = 0;
    }
}

function CharacterSet_Init(infoFile) {
    var infoObj = gEngine.ResourceMap.retrieveAsset(infoFile);
    var i;
    for (i = 0; i < infoObj.length; ++i) {
        CharacterSet.push(new Character(infoObj[i]));
    }
}
