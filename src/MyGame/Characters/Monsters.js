function initMonsters() {
    window.Monsters = {
        "zhuzishan-xiyijing": new Character({
            "Name": "zhuzishan-xiyijing",
            "HP": 274,
            "VP": 99999999,
            "ATK": 54,
            "DEF": 54,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "锤击",
                    "VP": 100,
                    "atkNumber": 15,
                    "defNumber": 30,
                    "turn": 3
                }
            ],
            "actionPolicy": new InTurnPolicy([0, -1]),
        }),
        "zhuzishanjiao-wangling": new Character({
            "Name": "zhuzishanjiao-wangling",
            "HP": 587,
            "VP": 99999999,
            "ATK": 39,
            "DEF": 120,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "睡懒觉",
                    "VP": -18,
                    "HP": "25",
                    "atkPercent": 1.27
                },
                {
                    "name": "锤击",
                    "VP": 57,
                    "atkNumber": 50,
                    "defNumber": 30,
                    "turn": 3,
                }
            ]
        }),
        "huoyanshankou-xiaozu": new Character({
            "Name": "huoyanshankou-xiaozu",
            "HP": 140,
            "VP": 99999999,
            "ATK": 70,
            "DEF": 350,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "睡懒觉",
                    "VP": -18,
                    "HP": "25",
                    "atkPercent": 1.27
                },
                {
                    "name": "锤击",
                    "VP": 57,
                    "atkNumber": 50,
                    "defNumber": 30,
                    "turn": 3,
                }
            ]
        }),
        "huoyanshandi-xiaozu": new Character({
            "Name": "huoyanshandi-xiaozu",
            "HP": 140,
            "VP": 99999999,
            "ATK": 70,
            "DEF": 250,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "睡懒觉",
                    "VP": -18,
                    "HP": "25",
                    "atkPercent": 1.27
                },
                {
                    "name": "锤击",
                    "VP": 57,
                    "atkNumber": 50,
                    "defNumber": 30,
                    "turn": 3,
                }
            ]
        }),
        "huoyanshandi-heifengguai": new Character({
            "Name": "huoyanshandi-heifengguai",
            "HP": 220,
            "VP": 99999999,
            "ATK": 70,
            "DEF": 350,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "睡懒觉",
                    "VP": -18,
                    "HP": "25",
                    "atkPercent": 1.27
                },
                {
                    "name": "锤击",
                    "VP": 57,
                    "atkNumber": 50,
                    "defNumber": 30,
                    "turn": 3,
                }
            ]
        }),
    };
}
