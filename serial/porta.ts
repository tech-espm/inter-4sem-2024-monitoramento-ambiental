import { SerialPort } from "serialport";

// https://serialport.io/docs/api-stream/

class Porta {
	private valido = true;
	private iniciando = false;
	private recebendoDados = false;
	private serialPort: SerialPort | null = null;

	public readonly nome: string;
	public readonly velocidade: number;
	public onDadosRecebidos: ((buffer: Buffer) => Promise<void> | void) | null = null;
	public onTerminado: ((erro: Error | null) => void) | null = null;

	public constructor(nome: string, velocidade: number, onDadosRecebidos?: ((buffer: Buffer) => Promise<void> | void) | null, onTerminado?: ((erro: Error | null) => void) | null) {
		this.nome = nome;
		this.velocidade = velocidade;
		this.onDadosRecebidos = onDadosRecebidos || null;
		this.onTerminado = onTerminado || null;
	}

	public iniciar(): Promise<void> {
		if (!this.valido || this.iniciando || this.serialPort)
			return Promise.resolve();

		this.iniciando = true;

		return new Promise((resolve, reject) => {
			try {
				const serialPort = new SerialPort({
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

				serialPort.on("data", async (chunk: Buffer) => {
					if (!this.recebendoDados || !this.serialPort || !chunk.byteLength || !this.onDadosRecebidos)
						return;

					const serialPort = this.serialPort;

					serialPort.pause();

					try {
						await this.onDadosRecebidos(chunk);
					} catch (ex: any) {
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
			} catch (ex: any) {
				reject(ex);
			}
		});
	}

	public destruir(): Promise<void> {
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
			} catch (ex: any) {
				resolve();
			}
		});
	}

	public async limpar(): Promise<void> {
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

	public async enviar(): Promise<void> {
	}
}

export = Porta;
