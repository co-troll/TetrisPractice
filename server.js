"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const ws_1 = require("ws");
const fs = require("fs");
const app = express();
const PORT = 8000;
app.use(express.static("public"));
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
const wss = new ws_1.WebSocketServer({ port: 8001 });
wss.on("connection", (ws, request) => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(showHighScores()));
    });
    console.log(`새로운 유저 접속: ${request.socket.remoteAddress}`);
    ws.on("close", () => {
        wss.clients.forEach((client) => {
        });
    });
    ws.on("message", (data) => {
        const [score, nickname] = data.toString().split("-");
        checkHighScore(Number(score), nickname);
        console.log(data.toString());
        wss.clients.forEach(client => {
            client.send(JSON.stringify(showHighScores()));
        });
    });
});
const showHighScores = () => {
    const json = fs.readFileSync('HighScores.json', "utf-8");
    const highScores = JSON.parse(json);
    return highScores;
    const highScoreList = document.getElementById("highScores");
    highScoreList.innerHTML = highScores.map((score) => `<li>${score.score} - ${score.nickname}`).join("");
};
const checkHighScore = (score, nickname) => {
    var _a, _b;
    const json = fs.readFileSync('HighScores.json', "utf-8");
    const highScores = JSON.parse(json);
    const lowestScore = (_b = (_a = highScores[9]) === null || _a === void 0 ? void 0 : _a.score) !== null && _b !== void 0 ? _b : 0;
    if (score > lowestScore) {
        saveHighScore(score, nickname, highScores);
    }
};
const saveHighScore = (score, nickname, highScores) => {
    highScores.push({ score, nickname });
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(9);
    fs.writeFileSync('HighScores.json', JSON.stringify(highScores));
};
