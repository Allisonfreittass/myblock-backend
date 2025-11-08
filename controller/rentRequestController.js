const mongoose = require('mongoose');
const RentRequest = require('../models/RentRequest');

exports.findAll = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const data = await RentRequest.find({ owner: req.user.userId })
            .populate({
                path: 'property',
                select: 'title fees.rentAmount imageUrls'
            })
            .populate({
                path: 'tenant',
                select: 'name profilePictureUrl' 
            })
            .sort({ createdAt: -1 }); 

        return res.status(200).send(data);

    } catch (error) {
        console.error('Erro ao listar requests:', error);
        res.status(500).json({
            error: 'Erro ao listar requests'
        });
    }
}

exports.create = async (req, res) => {
    try {
        if (!req.user.userId || !req.user.walletAddress) {
            return res.status(401).json({ error: 'Usuário não autenticado ou sem carteira cadastrada.' });
        }

        const { propertyId, ownerId } = req.body;

        const newRequest = new RentRequest({
            property: propertyId,
            owner: ownerId,
            tenant: req.user.userId,
            tenantWalletAddress: req.user.walletAddress
        });

        await newRequest.save();
        return res.status(201).json(newRequest);

    } catch (error) {
        console.error('Erro ao criar request:', error);
        res.status(500).json({
            error: 'Erro ao criar requests'
        });
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(req.body)

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const requestToUpdate = await RentRequest.findById(id);
        if (requestToUpdate.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Você não tem permissão para atualizar este pedido.' });
        }
        
        const updatedData = await RentRequest.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );

        return res.status(200).json(updatedData);

    } catch (error) {
        console.error('Erro ao atualizar request:', error);
        res.status(500).json({
            error: 'Erro ao atualizar requests'
        });
    }
}