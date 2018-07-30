function initMonsters() {
    window.Monsters = {
        "zhuzishan-xiyijing": new Character({
            "Name": "zhuzishan-xiyijing",
            "HP": 274,
            "VP": 99999999,
            "ATK": 47,
            "DEF": 62,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "锤击",
                    "VP": 100,
                    "atkNumber": 28,
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
            "DEF": 92,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "睡懒觉",
                    "VP": -18,
                    "HP": 26,
                    "atkPercent": 1.25
                }
            ],
            "actionPolicy": new RandomPolicy([0, -1]),
        }),
        "huoyanshankou-xiaozu": new Character({
            "Name": "huoyanshankou-xiaozu",
            "HP": 147,
            "VP": 99999999,
            "ATK": 62,
            "DEF": 350,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "撕咬",
                    "VP": 58,
                    "dmg": 19,
                }
            ],
            "actionPolicy": new InTurnPolicy([0, -1, -1]),
        }),
        "huoyanshandi-xiaozu": new Character({
            "Name": "huoyanshandi-xiaozu",
            "HP": 154,
            "VP": 99999999,
            "ATK": 69,
            "DEF": 270,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "撕咬",
                    "VP": 66,
                    "dmg": 24
                }
            ],
            "actionPolicy": new InTurnPolicy([0, -1, -1]),

        }),
        "huoyanshandi-heifengguai": new Character({
            "Name": "huoyanshandi-heifengguai",
            "HP": 260,
            "VP": 99999999,
            "ATK": 72,
            "DEF": 330,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "睡懒觉",
                    "VP": -20,
                    "HP": 43,
                    "atkPercent": 1.10
                },
                {
                    "name": "狂怒",
                    "VP": 100,
                    "dmgPercent": 1.05,
                    "atkNumber": 8,
                    "turn": 99999
                }
            ],
            "actionPolicy": new InTurnPolicy([1, 0, -1]),
        }),
        "shishi-huangfengguai": new Character({
            "Name": "shishi-huangfengguai",
            "HP": 400,
            "VP": 99999999,
            "ATK": 74,
            "DEF": 83,
            "SPD": 30,
            "characterType": _C.Monster,
            "skills": [
                {
                    "name": "生命抽取",
                    "VP": 25,
                    "dmgPercent": 1.13,
                    "recoverPercent": 0.8
                },
                {
                    "name": "剧毒尾针",
                    "VP": 200,
                    "dmgPercent": 0.5,
                    "continuousDmg": 20,
                    "turn": 3
                }
            ],
            "actionPolicy": new InTurnPolicy([1, 0, 0, -1]),
        }),
    };
}
