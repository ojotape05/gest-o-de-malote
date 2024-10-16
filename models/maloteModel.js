// models/maloteModel.js

class Malote {
    constructor() {
        this._malotes = []; // Array para armazenar todos os malotes
    }

    adicionarMalote(infos) {
        const _responsavelEntrega = infos.responsavel_entrega;
        const _responsavelRecebimento = infos.responsavel_recebimento;
        const _dataRecebimento = new Date();

        const malote = {
            "_id": _dataRecebimento.getTime(),
            "qntd_objetos": infos.qntd_objetos,
            "dt_recebimento": _dataRecebimento.toLocaleString('pt-BR'),
            "documentos": [],
            "correspondente": "",
            "nome_correspondente": "",
            "cnpj_correspondente": "",
            "responsavel_entrega": _responsavelEntrega,
            "responsavel_recebimento": _responsavelRecebimento,
            "observacao": ""
        };

        if (malote.qntd_objetos > 0) {
            if (infos.documentos && infos.documentos.length > 0) {
                infos.documentos.forEach((documento, index) => {
                    if (typeof documento.titulo_documento !== "string") {
                        throw new Error(`Confira o título do documento - index: ${index}`);
                    }
                    if (typeof documento.tipo !== "string") {
                        throw new Error(`Confira o tipo do documento - index: ${index}`);
                    }
                    if (typeof documento.cid_agencia !== "number") {
                        throw new Error(`Confira a agência destinatária do documento - index: ${index}`);
                    }

                    // Adiciona o documento ao malote
                    malote.documentos.push({
                        _id: `${malote._id}_${index}`,
                        titulo_documento: documento.titulo_documento,
                        tipo: documento.tipo,
                        cid_agencia: documento.cid_agencia,
                        unidade_destinataria: `AGÊNCIA ${documento.cid_agencia}`
                    });
                });
            } else {
                throw new Error("Não há documentos a serem cadastrados no malote.")
            }

            malote.correspondente = infos.correspondente
            if (infos.correspondente === true) {
                
                if (typeof infos.nome_correspondente === "string") {
                    malote.correspondente = true

                    if (infos.nome_correspondente && infos.nome_correspondente !== ""){
                        malote.nome_correspondente = infos.nome_correspondente
                    } else {
                        throw new Error("Nome do correspondente não identificado")
                    }

                    if (infos.cnpj_correspondente && infos.cnpj_correspondente !== ""){
                        malote.cnpj_correspondente = infos.cnpj_correspondente
                    } else {
                        throw new Error("CNPJ do correspondente não identificado")
                    }

                    malote.responsavel_entrega = typeof infos.responsavel_entrega === "string" ? infos.responsavel_entrega : "Não informado";
                } else {
                    malote.correspondente = false;
                    malote.nome_correspondente = undefined;
                    malote.responsavel_entrega = undefined;
                    malote.cnpj_correspondente = undefined;
                }
            } else {
                malote.correspondente = false;
                malote.cnpj_correspondente = undefined;
                malote.nome_correspondente = undefined;
                malote.responsavel_entrega = undefined;
            }

            if (typeof infos.observacao === "string") {
                malote.observacao = infos.observacao;
            }
        }

        this._malotes.push(malote);
        console.log(this._malotes);
        return malote;
    }

    obterMalotes() {
        console.log(this._malotes);
        return this._malotes;
    }

    removerMalote(id) {
        const index = this._malotes.findIndex(malote => malote._id === id);
        if (index !== -1){
            const maloteRemovido = this._malotes.splice(index,1);
            return maloteRemovido
        } else {
            throw new Error(`Malote com id ${id} não encontrado.`);
        }
    }

    editarMalote(editInfos) {
        const index = this._malotes.findIndex(malote => malote._id === editInfos.id);
        if  (index !== -1 ) {
            let maloteForEdit = this._malotes[index]
            console.log("beforeEdit:",maloteForEdit)
            for (let chave in editInfos) {

                // Aqui é descartada a tratativa dos documentos e também é evitada a tratativa de nome_correspondente para ser
                // computada automaticamente seguindo a regra do algoritmo.
                //console.log(chave)
                if(chave !== 'id' && chave !== 'documentos' && chave !== 'nome_correspondente'){
                    
                    if (chave === 'correspondente' && editInfos[chave] === false){
                        maloteForEdit['correspondente'] = false
                        maloteForEdit['nome_correspondente'] = undefined         
                        maloteForEdit['cnpj_correspondente'] = undefined

                    } else if (chave === 'correspondente' && editInfos[chave] === true){
                        maloteForEdit['correspondente'] = true

                        if (editInfos['nome_correspondente'] && editInfos['nome_correspondente'] !== ""){
                            maloteForEdit['nome_correspondente'] = editInfos['nome_correspondente']
                        } else {
                            throw new Error("Nome do correspondente não identificado")
                        }

                        if (editInfos['cnpj_correspondente'] && editInfos['cnpj_correspondente'] !== ""){
                            maloteForEdit['cnpj_correspondente'] = editInfos['cnpj_correspondente'] 
                        } else {
                            throw new Error("CNPJ do correspondente não identificado")
                        }
                        
                       
                    } else if (chave === 'dt_recebimento' || chave === 'qntd_objetos' || chave === 'correspondente' || chave === 'responsavel_recebimento') {
                        
                        if(editInfos[chave] !== undefined && editInfos[chave] !== ""){
                            maloteForEdit[chave] = editInfos[chave]
                        } else {
                            throw new Error(`O atributo ${chave} não pode estar vazio.`)
                        }

                    } else {
                        maloteForEdit[chave] = editInfos[chave]
                    }

                // Tratativa para documentos
                } else if (chave === 'documentos') {
                    
                    let documentosForEdit_List = editInfos[chave]
                    
                    // console.log("Documentos ainda não scriptados.")
                    // console.log("documentosForEdit_List:",documentosForEdit_List)
                    // console.log("documentos:", this._malotes[index].documentos)

                    documentosForEdit_List.map( documentoEditInfos => {
                        // console.log("documento_trabalhado (edicao):",documentoEditInfos)
                        const indexDoc = this._malotes[index].documentos.findIndex(documento => documento._id === documentoEditInfos.id)
                        if (indexDoc !== -1) {
                            let documentoForEdit = this._malotes[index].documentos[indexDoc]
                            // console.log("documento_a_editar:",documentoForEdit)
                            for (let chave_doc in documentoEditInfos) {
                                documentoForEdit[chave_doc] = documentoEditInfos[chave_doc]
                            }
                        } else {
                            throw new Error(`Você está tentando manipular um documento inesxistente; id: ${documentoEditInfos.id}`)
                        }
                    })
                    
                }

            }
            console.log("afterEdit:", this._malotes[index])
            return maloteForEdit
        } else {
            throw new Error(`Malote com id ${editInfos.id} não encontrado.`);
        }
    }
}

// Exporta uma única instância da classe Malote
module.exports = new Malote();
