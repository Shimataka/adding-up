'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input':rs, 'output': {} });

const prefectureDataMap = new Map();// key: pref , value: data

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popul0: 0,
                popul5: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popul0 = popu;
        }
        if (year === 2015) {
            value.popul5 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap ) {
        value.change = value.popul5 / value.popul0;
    }
    const rankingArray = Array.from(prefectureDataMap).sort(
        // 比較関数(=>の後ろが正負0でpair1,2の入れ替え方を変える)
        (pair1, pair2) => pair2[1].change - pair1[1].change
    );
    const rankingstrings = rankingArray.map(([key, value]) => {
        return key + ': ' + value.popul0 + '=>' + value.popul5 + ' increase rate:' + value.change;
    })
    console.log(rankingstrings);
});