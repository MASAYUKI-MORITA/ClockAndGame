"use strict";

window.onload = init;

// 配列シャッフル
Array.prototype.shuffle = function(){
    var i = this.length;
    while(i){
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

// 広域変数
var scale = 13, timer = NaN, score = 0, flipTimer, prevCard, startTime, flashTimer = 0;

// 初期化関数
function init(){
    var body = document.querySelector("body");
    var table = document.createElement("table");
    table.id = "table";

    var cards = [];
    for(var i = 1; i <= scale; i++){
        cards.push([i, "red"]);
        cards.push([i, "blue"]);
        cards.push([i, "yellow"]);
        cards.push([i, "green"]);
    }
    cards.shuffle();

    for(var i = 0; i < 4; i++){
        var tr = document.createElement("tr");
        for(var j = 0; j < scale; j++){
            var td = document.createElement("td");
            td.className = "card back";
            td.number = cards[i * scale + j][0];
            td.color = cards[i * scale + j][1];
            td.onclick = flip;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    body.insertBefore(table, body.firstChild);

    startTime = new Date();
    timer = setInterval(tick, 1000);
}

// 経過時間計測用タイマー
function tick(){
    var now = new Date();
    var elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    document.getElementById("time").textContent = elapsed;
}

// カード裏返し
function flip(e){
    var src = e.srcElement;
    if(flipTimer || src.textContent != ""){
        return;
    }

    var num = src.number;
    src.className = "card " + src.color;
    src.textContent = num;

    // １枚目
    if(prevCard == null){
        prevCard = src;
        return;
    }

    // ２枚目
    if(prevCard.number == num){
        if(++score == scale * 2){
            clearInterval(timer);
            document.getElementById("time").style.color = "red";
            flash();
        }
        prevCard = null;
        clearTimeout(flipTimer);
    } else {
        flipTimer = setTimeout(function(){
            src.className = "card back";
            src.textContent = "";
            prevCard.className = "card back";
            prevCard.textContent = "";
            prevCard = null;
            flipTimer = NaN;
        }, 1000);
    }
}

function flash(){
    var flashCard = document.getElementsByClassName("card");
    var colors = ["#DE6641", "#F5B090" , "#E8AC51", "#FCD7A1", "#F2E55C", "#FFF9B1", "#39A869", "#A5D4AD", "#4784BF", "#A3BCE2", "#5D5099", "#A59ACA", "#A55B9A", "#CFA7CD"];

    for(var i = 0; i < flashCard.length; i++){
        flashCard[i].style.backgroundColor = colors[(i + flashTimer) % colors.length];
    }

    flashTimer++;

    setTimeout(flash, 500);
}