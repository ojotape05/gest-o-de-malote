//models/maloteModel.js

let _malotes = [];

class Malote {
    constructor(infos) {

        let _responsavelEntrega = infos.responsavel_entrega;
        let _responsavelRecebimento = infos.responsavel_recebimento;
        let _dataRecebimento = new Date();

        //this.adicionarMalote(infos)
        // Infos => objeto javascript
        this.adicionarMalote = (infos) => {

            let documentos = [];

            let malote = {
                "id": _dataRecebimento.getTime(),
                "qntd_objetos": infos.qntd_objetos,
                "dt_recebimento": _dataRecebimento.toUTCString(),
                "documentos": documentos,
                "correspondente": "",
                "nome_correspondente": "",
                "responsavel_entrega": _responsavelEntrega,
                "responsavel_recebimento": _responsavelRecebimento,
                "observacao": ""
            };

            if (malote.qntd_objetos > 0) {

                if (infos.documentos.length > 0) {

                    let index = 0;
                    infos.documentos.map(documento => {
                        let documento_temp = {};
                        if (typeof (documento.titulo_documento) == "string") {
                            documento_temp.titulo_documento = documento.titulo_documento;
                        } else {
                            throw new Error(`Confira o título do documento - index: ${index}`);
                        }
                        if (typeof (documento.tipo) == "string") {
                            documento_temp.tipo = documento.tipo;
                        } else {
                            throw new Error(`Confira o tipo do documento - index: ${index}`);
                        }
                        if (typeof (documento.cid_agencia) == "number") {
                            documento_temp.cid_agencia = documento.cid_agencia;
                            documento_temp.unidade_destinataria = `AGENCIA ${documento.cid_agencia}`;
                        } else {
                            throw new Error(`Confira a agência destinataria do documento - index: ${index}`);
                        }
                        index += 1;

                    });

                    malote.documentos = infos.documentos;
                }

                if (infos.correspondente == true) {
                    if (typeof (infos.nome_correspondente) == "string") {
                        malote.nome_correspondente = infos.nome_correspondente;

                        if (typeof (infos.responsavel_entrega) == "string") {
                            malote.responsavel_entrega = infos.responsavel_entrega;
                        } else {
                            malote.responsavel_entrega = "Não informado";
                        }

                    } else {
                        malote.nome_correspondente = undefined;
                        malote.responsavel_entrega = undefined;
                    }

                } else {
                    malote.nome_correspondente = undefined;
                    malote.responsavel_entrega = undefined;
                }

                if (typeof (infos.observacao) == "string") {
                    malote.observacao = infos.observacao;
                }

            }

            _malotes.push(malote);
            console.log(_malotes)
            return malote;
        };

        this.obterMalotes = () => {
            console.log(_malotes);
            return _malotes;
        };

    }
}

module.exports = { Malote }