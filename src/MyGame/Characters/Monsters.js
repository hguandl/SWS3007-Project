function initMonsters() {
    window.Monsters = {
        "zhuzishan-xiyijing": new Character({
            "Name": "zhuzishan-xiyijing",
            "HP": 274,
            "VP": 99999999,
            "ATK": 44,
            "DEF": 54,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "锤击",
                    "VP": 100,
                    "atkNumber": 23,
                    "defNumber": 20,
                    "turn": 3
                }
            ],
            "actionPolicy": new InTurnPolicy([0, -1]),
        }),
        "zhuzishanjiao-wangling": new Character({
            "Name": "zhuzishanjiao-wangling",
            "HP": 487,
            "VP": 99999999,
            "ATK": 41,
            "DEF": 98,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "睡懒觉",
                    "VP": -18,
                    "HP": 24,
                    "atkPercent": 1.20
                }
            ],
            "actionPolicy": new RandomPolicy([0, -1]),
        }),
        "huoyanshankou-xiaozu": new Character({
            "Name": "huoyanshankou-xiaozu",
            "HP": 147,
            "VP": 99999999,
            "ATK": 65,
            "DEF": 350,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "撕咬",
                    "VP": 58,
                    "dmg": 13,
                }
            ],
            "actionPolicy": new InTurnPolicy([0, -1, -1]),
        }),
        "huoyanshandi-xiaozu": new Character({
            "Name": "huoyanshandi-xiaozu",
            "HP": 154,
            "VP": 99999999,
            "ATK": 70,
            "DEF": 270,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "撕咬",
                    "VP": 66,
                    "dmg": 17
                }
            ],
            "actionPolicy": new InTurnPolicy([0, -1, -1]),

        }),
        "huoyanshandi-heifengguai": new Character({
            "Name": "huoyanshandi-heifengguai",
            "HP": 220,
            "VP": 99999999,
            "ATK": 90,
            "DEF": 330,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "睡懒觉",
                    "VP": -20,
                    "HP": 50,
                    "atkPercent": 1.1
                },
                {
                    "name": "三昧真火",
                    "VP": 88,
                    "dmgPercent": 0.64
                }
            ],
            "actionPolicy": new InTurnPolicy([1, 0, -1]),
        }),
    };
}
