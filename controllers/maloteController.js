//controlers/maloteController.js

const maloteModel = require("../models/maloteModel")
exports.adicionarMalote = (req, res) => {
    try{
        let infos = req.body;
        const malote = maloteModel.adicionarMalote(infos);
        res.status(201).json({malote: malote});
    } catch (error) {
        res.status(400).json({error: error.message})
    }

};

exports.obterMalotes = (req, res) => {
    try{
        const malotes = maloteModel.obterMalotes();
        console.log(malotes)
        res.status(200).json({malotes: malotes });
    } catch(error) {
        res.status(500).json({error: error.message})
    }
};

exports.removerMalote = (req, res) => {
    try{
        console.log(req.params)
        const id = parseInt(req.params.id);
        const maloteRemovido = maloteModel.removerMalote(id);
        res.status(200).json({message: "Malote removido com sucesso", maloteRemovido: maloteRemovido})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

exports.editarMalote = (req, res) => {
    try{
        const editInfos = req.body;
        const maloteForEdit = maloteModel.editarMalote(editInfos);
        res.status(200).json({message: "Malote encontrado para edição", malote: maloteForEdit})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}