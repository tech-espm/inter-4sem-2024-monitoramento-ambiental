"use strict";
const serialport_1 = require("serialport");
// https://serialport.io/docs/api-stream/
class Porta {
    constructor(nome, velocidade, onDadosRecebidos, onTerminado) {
        this.valido = true;
        this.iniciando = false;
        this.recebendoDados = false;
        this.serialPort = null;
        this.onDadosRecebidos = null;
        this.onTerminado = null;
        this.nome = nome;
        this.velocidade = velocidade;
        this.onDadosRecebidos = onDadosRecebidos || null;
        this.onTerminado = onTerminado || null;
    }
    iniciar() {
        if (!this.valido || this.iniciando || this.serialPort)
            return Promise.resolve();
        this.iniciando = true;
        return new Promise((resolve, reject) => {
            try {
                const serialPort = new serialport_1.SerialPort({
                    path: this.nome,
                    autoOpen: false,
                    baudRate: this.velocidade,
                    dataBits: 8,
                    endOnClose: false,
                    lock: true,
                    parity: "none",
                    rtscts: false,
                    stopBits: 1,
                    xany: false,
                    xoff: false,
                    xon: false,
                });
                serialPort.on("close", async () => {
                    console.log("close");
                    await this.limpar();
                    await this.destruir();
                    if (this.onTerminado)
                        this.onTerminado(null);
                });
                serialPort.on("error", async (error) => {
                    console.log("error: " + (error.message || error.toString()));
                    await this.limpar();
                    await this.destruir();
                    if (this.onTerminado)
                        this.onTerminado(error);
                });
                serialPort.on("data", async (chunk) => {
                    if (!this.recebendoDados || !this.serialPort || !chunk.byteLength || !this.onDadosRecebidos)
                        return;
                    const serialPort = this.serialPort;
                    serialPort.pause();
                    try {
                        await this.onDadosRecebidos(chunk);
                    }
                    catch (ex) {
                        console.log("exceção ao tratar dados recebidos: " + (ex.message || ex.toString()));
                    }
                    if (this.recebendoDados)
                        serialPort.resume();
                });
                serialPort.open(async (error) => {
                    console.log("open: " + (error ? (error.message || error.toString()) : "null"));
                    this.iniciando = false;
                    this.serialPort = serialPort;
                    if (error) {
                        this.valido = false;
                        await this.destruir();
                        reject(error);
                        return;
                    }
                    await this.limpar();
                    this.recebendoDados = true;
                    resolve();
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    destruir() {
        if (!this.serialPort)
            return Promise.resolve();
        this.valido = false;
        this.recebendoDados = false;
        return new Promise((resolve) => {
            try {
                if (!this.serialPort) {
                    resolve();
                    return;
                }
                this.serialPort.close((error) => {
                    resolve();
                });
                this.serialPort = null;
            }
            catch (ex) {
                resolve();
            }
        });
    }
    async limpar() {
        if (!this.valido || !this.serialPort)
            return Promise.resolve();
        return new Promise((resolve) => {
            if (!this.serialPort) {
                resolve();
                return;
            }
            this.serialPort.flush(() => {
                resolve();
            });
        });
    }
    async enviar() {
    }
}
module.exports = Porta;
//# sourceMappingURL=porta.js.map