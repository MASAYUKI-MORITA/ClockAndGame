"use strict";

window.onload = init;

var data = [
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 2, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 0, 0, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 0, 0, 2, 0, 0, 2, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 0, 6, 0, 6, 6, 6, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 0, 0, 0, 6, 0, 6, 6, 6, 0, 6, 6, 6, 6, 0, 0, 1, 1, 6, 6],
    [6, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 6, 6],
    [6, 6, 6, 6, 6, 0, 6, 6, 6, 6, 0, 6, 0, 6, 0, 0, 1, 1, 6, 6],
    [6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
];

var gc, px = 12, py = 8, timer = 0, clearFlag = false;

// 初期化関数
function init(){
    gc = document.getElementById("soko").getContext("2d");
    onkeydown = mykeydown;
    repaint();
}

function u(){mykeydown({keyCode: 38});}
function d(){mykeydown({keyCode: 40});}
function l(){mykeydown({keyCode: 37});}
function r(){mykeydown({keyCode: 39});}

function mykeydown(e){
    if(clearFlag){return;}

    var dx0 = px, dx1 = px, dy0 = py, dy1 = py;
    switch(e.keyCode){
        case 37:
            dx0--;
            dx1 -= 2;
        break;
        case 38:
            dy0--;
            dy1 -= 2;
        break;
        case 39:
            dx0++;
            dx1 += 2;
        break;
        case 40:
            dy0++;
            dy1 += 2;
        break;
    }


    if((data[dy0][dx0] & 0x2) == 0){ // ← 「１マス先の進行方向は通路or目的地」
        // 荷物なし＆壁なし → 進む
        px = dx0;
        py = dy0;
    } else if((data[dy0][dx0] & 0x6) == 2){ // ← 「１マス先の進行方向は荷物」
        // 進行方向に荷物あり
        if((data[dy1][dx1] & 0x2) == 0){ // ← 「２マス先の進行方向は通路or目的地」
            // 荷物なし＆壁なし → 進む
            data[dy0][dx0] ^= 2; // ← 「^は排他論理和。0を1に、1を0にする。2ビット目を反転し、１マス先の荷物をクリア」
            // 隣の荷物をクリア
            data[dy1][dx1] |= 2; // ← 「|はOR演算子。2ビット目を1にしている。２マス先に荷物をセット」
            // 更に先に荷物をセット
            px = dx0;
            py = dy0;
        }
    }

    repaint();
}

function repaint(){
    gc.fillStyle = "black";
    gc.fillRect(0, 0, 800, 440);

    for(var y = 0; y < data.length; y++){
        for(var x = 0; x < data[y].length; x++){
            if(data[y][x] & 0x1){ // ← 「01とAND演算をすると、01（ゴール）のみが引っかかる」
                gc.drawImage(imgGoal, x * 40, y * 40, 40, 40);
            }
            if(data[y][x] & 0x2){ // ← 「010とAND演算をすると、010（荷物）と110（壁）が引っかかる」
                gc.drawImage(imgLuggage, x * 40, y * 40, 40, 40);
            }
            if(data[y][x] == 6){ // ← 「6（壁）しかtrueにならない」
                gc.drawImage(imgWall, x * 40, y * 40, 40, 40);
            }
        }
        gc.drawImage(imgWorker, px * 40, py * 40, 40, 40); // ←　「プレイヤー」
    }
    if(clearFlag){
        flash();
    } else {
        clearCheck();
    }
}

function clearCheck(){
    var count = 0;

    for(var y = 0; y < data.length; y++){
        for(var x = 0; x < data[y].length; x++){
            if(data[y][x] == 0x3){
                count++;
            }
        }
    }

    if(count == 6){
        clearFlag = true;
        flash();
    }
}

function flash(){
    var text = "ステージクリア";
    var colors = ["#DE6641", "#F5B090" , "#E8AC51", "#FCD7A1", "#F2E55C", "#FFF9B1", "#39A869", "#A5D4AD", "#4784BF", "#A3BCE2", "#5D5099", "#A59ACA", "#A55B9A", "#CFA7CD"];
    var result;

    for(var i = 0; i < text.length; i++){
        gc.fillStyle = colors[(i + timer) % colors.length];
        gc.font = "bold 80px 'Meiryo'";
        gc.fillText(text.charAt(i), 60 + i * 100, 180);
    }

    timer++;

    setTimeout(repaint, 500);
}