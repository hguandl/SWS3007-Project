function initMonsters() {
    window.Monsters = {
        "zhuzishan-xiyijing": new Character({
            "Name": "zhuzishan-xiyijing",
            "HP": 243,
            "VP": 99999999,
            "ATK": 35,
            "DEF": 50,
            "SPD": 30,
            "characterType": 1,
            "skills": [
                {
                    "name": "bat strike",
                    "VP": 57,
                    "atkNumber": 50,
                    "defNumber": 30,
                    "turn": 3
                }
            ]
        }),
        "zhuzishandi-wanghun": new Character({
            "Name": "zhuzishandi-wanghun",
            "HP": 413,
            "VP": 99999999,
            "ATK": 40,
            "DEF": 80,
            "SPD": 30,
            "characterType": 1,
            "skills": [
                {
                    "name": "slack sleep",
                    "VP": -18,
                    "HP": "25",
                    "atkPercent": 1.27
                },
                {
                    "name": "bat strike",
                    "VP": 57,
                    "atkNumber": 50,
                    "defNumber": 30,
                    "turn": 3,
                }
            ]
        }),
        "huoyanshankou-xiaozu": new Character({
            "Name": "huoyanshankou-xiaozu",
            "HP": 255,
            "VP": 99999999,
            "ATK": 100,
            "DEF": 300,
            "SPD": 30,
            "characterType": 1,
            "skills": [
                {
                    "name": "slack sleep",
                    "VP": -18,
                    "HP": "25",
                    "atkPercent": 1.27
                },
                {
                    "name": "bat strike",
                    "VP": 57,
                    "atkNumber": 50,
                    "defNumber": 30,
                    "turn": 3,
                }
            ]
        }),
    };
}
