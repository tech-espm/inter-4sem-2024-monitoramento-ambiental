"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Porta = require("./porta");
const nome = "COM13";
const velocidade = 115200;
const urlPost = "http://localhost:6060/insert_data";
let abrindo = false;
let porta = null;
let objetoAberto = false;
let dadosValidos = 0;
let dados = Buffer.alloc(2048);
async function onDadosRecebidos(buffer) {
    for (let i = 0; i < buffer.byteLength; i++) {
        const c = buffer[i];
        switch (c) {
            case 0x7b: // {
                objetoAberto = true;
                dadosValidos = 1;
                dados[0] = c;
                break;
            case 0x7d: // }
                if (dadosValidos < dados.byteLength) {
                    if (objetoAberto) {
                        dados[dadosValidos] = c;
                        dadosValidos++;
                        try {
                            const json = dados.toString("utf8", 0, dadosValidos);
                            try {
                                const obj = JSON.parse(json);
                                console.log(json);
                                // https://axios-http.com/docs/post_example
                                axios_1.default.post(urlPost, obj).then((response) => {
                                    console.log("post OK");
                                }, (error) => {
                                    console.log("erro de post: " + error);
                                });
                            }
                            catch (ex) {
                                console.log("erro ao converter a string para JSON: " + ex.message);
                            }
                        }
                        catch (ex) {
                            console.log("erro ao gerar a string: " + ex.message);
                        }
                    }
                }
                objetoAberto = false;
                dadosValidos = 0;
                break;
            default:
                if (dadosValidos < dados.byteLength) {
                    dados[dadosValidos] = c;
                    dadosValidos++;
                }
                break;
        }
    }
}
function onTerminado(erro) {
    porta = null;
    console.log("onTerminado: " + (erro ? (erro.message || erro.toString()) : "null"));
}
async function criarPorta() {
    abrindo = true;
    console.log("abrindo porta...");
    try {
        objetoAberto = false;
        dadosValidos = 0;
        porta = new Porta(nome, velocidade, onDadosRecebidos, onTerminado);
        await porta.iniciar();
        console.log("porta aberta");
    }
    catch (ex) {
        if (porta) {
            await porta.destruir();
            porta = null;
        }
        console.log("exceção ao abrir a porta: " + (ex.message || ex.toString()));
    }
    finally {
        abrindo = false;
    }
}
setInterval(() => {
    if (!abrindo && !porta)
        criarPorta();
}, 1000);
//# sourceMappingURL=app.js.map