"use strict";

window.onload = init;

function init(){
    var body = document.querySelector("body");
    var cnvs = document.createElement("canvas");
    cnvs.id = "canvas";
    cnvs.style.border = "1px solid gray";
    cnvs.width = 400;
    cnvs.height = 400;
    body.insertBefore(cnvs, body.firstChild);

    admin();
    var clock = setInterval(admin, 1000);
}

function admin(){
    var cnvs = document.getElementById("canvas");
    var ctx = cnvs.getContext("2d");
    ctx.clearRect(0, 0, cnvs.width, cnvs.height);

    // 文字盤を生成
    dial();

    // デジタル時計を生成
    digital();
    
    // 針時計を生成
    hand();
}

function dial(){
    var cnvs = document.getElementById("canvas");
    var ctx = cnvs.getContext("2d");

    // 文字盤を描画
    for(var i = 0; i < 60; i++){
        ctx.save();
        var r = Math.PI / 30 * i;
        ctx.translate(200, 180);
        ctx.rotate(r);

        if(i % 15 == 0){
            switch(i / 15){
                case 0:
                ctx.strokeStyle = "red";
                break;
                case 1:
                ctx.strokeStyle = "blue";
                break;
                case 2:
                ctx.strokeStyle = "yellow";
                break;
                case 3:
                ctx.strokeStyle = "green";
                break;
            }
        }
        
        if(i % 5 == 0){
            ctx.lineWidth *= 3;
        }

        ctx.beginPath();
        ctx.moveTo(0, -150);
        if(i % 5 == 0){
            if(i % 15 == 0){
                ctx.lineTo(0, -125);
            } else {
                ctx.lineTo(0, -135);
            }
        } else {
            ctx.lineTo(0, -140);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
}

function digital(){
    var cnvs = document.getElementById("canvas");
    var ctx = cnvs.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(120, 345, 160, 40);

    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();

    if(h < 10){h = "0" + now.getHours();}
    if(m < 10){m = "0" + now.getMinutes();}
    if(s < 10){s = "0" + now.getSeconds();}

    ctx.fillStyle = "white";
    ctx.font = "22pt 'Century Gothic'";
    ctx.fillText(h + ":" + m + ":" + s, 143, 375);
}

function hand(){
    var cnvs = document.getElementById("canvas");
    var ctx = cnvs.getContext("2d");

    var now = new Date();
    var h = now.getHours() % 12;
    var m = now.getMinutes();
    var s = now.getSeconds();

    var radH = (Math.PI * 2) / 12 * h + (Math.PI * 2) / 12 * (m / 60);
    var radM = (Math.PI * 2) / 60 * m;
    var radS = (Math.PI * 2) / 60 * s;

    for(var i = 0; i < 3; i++){
        ctx.save();
        ctx.translate(200, 180);
        switch(i){
            case 0:
            ctx.rotate(radH + Math.PI);
            ctx.lineWidth *= 5;
            break;
            case 1:
            ctx.rotate(radM + Math.PI);
            ctx.lineWidth *= 3;
            break;
            case 2:
            ctx.rotate(radS + Math.PI);
            break;
        }

        ctx.beginPath();
            
        switch(i){
            case 0:
            ctx.moveTo(0, 90);
            break;
            case 1:
            ctx.moveTo(0, 150);
            break;
            case 2:
            ctx.moveTo(0, 150);
            break;
        }

        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
}