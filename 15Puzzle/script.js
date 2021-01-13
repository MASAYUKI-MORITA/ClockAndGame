"use strict";

window.onload = init;

// 広域変数
var tiles = [];
var scale = 4;
var wave = {
    start: true,
    clear: false
};
var timer = 0;

// 初期化関数
function init(){
    var body = document.querySelector("body");
    var table = document.createElement("table");
    table.id = "table";
    for(var i = 0; i < scale; i++){
        var tr = document.createElement("tr");
        for(var j = 0; j < scale; j++){
            var td = document.createElement("td");
            var index = i * scale + j;
            td.className = "tile";
            td.index = index;
            td.value = index;
            td.textContent = index == 0 ? "" : index;
            td.onclick = click;
            tr.appendChild(td);
            tiles.push(td);
        }
        table.appendChild(tr);
    }
    body.insertBefore(table, body.firstChild);

    for(var i = 0; i < 1000; i++){
        click({
            srcElement: {
                index: Math.floor(Math.random() * Math.pow(scale, 2))
            }
        })
    }

    wave.start = false;
}

function click(e){
    if(wave.clear == true){return;}

    var i = e.srcElement.index;
    if(i - scale >= 0 && tiles[i - scale].value == 0){
        swap(i, i - scale);
    } else if(i + scale < Math.pow(scale, 2) && tiles[i + scale].value == 0){
        swap(i, i + scale);
    } else if(i % scale != 0 && tiles[i - 1].value == 0){
        swap(i, i - 1);
    } else if(i % scale != scale - 1 && tiles[i + 1].value == 0){
        swap(i, i + 1);
    }

    clearCheck();
}

function swap(i, j){
    var tmp = tiles[i].value;
    tiles[i].textContent = tiles[j].textContent;
    tiles[i].value = tiles[j].value;
    tiles[j].textContent = tmp;
    tiles[j].value = tmp;
}

function clearCheck(){
    if(wave.start == true){return;}

    for(var j = 0; j < tiles.length; j++){
        if(tiles[j].index != tiles[j].value){
            return;
        }

        if(j == tiles.length - 1){
            wave.clear = true;

            flash();
        }
    }
}

function flash(){
    var body = document.querySelector("body");
    var dltMsg = document.getElementById("clearMsg");
    if(dltMsg != null){body.removeChild(dltMsg)};

    var clearMsg = document.createElement("h1");
    clearMsg.id = "clearMsg";
    body.appendChild(clearMsg);

    var text = "☆+*....Clear....*+☆";
    var flashMsg = [];
    var colors = ["#DE6641", "#F5B090" , "#E8AC51", "#FCD7A1", "#F2E55C", "#FFF9B1", "#39A869", "#A5D4AD", "#4784BF", "#A3BCE2", "#5D5099", "#A59ACA", "#A55B9A", "#CFA7CD"];
    var result;

    for(var i = 0; i < text.length; i++){
        flashMsg.push(text.charAt(i));
    }

    for(var i = 0; i < flashMsg.length; i++){
        var span = document.createElement("span");
        span.style.color = colors[(i + timer) % colors.length];
        span.textContent = flashMsg[i];
        clearMsg.appendChild(span);
    }

    timer++;

    setTimeout(flash, 500);
}