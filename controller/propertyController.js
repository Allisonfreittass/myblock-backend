const Property = require('../models/Property');


exports.createProperty = async (req, res) => {
    const { title, description, imageUrl, rentAmount } = req.body;
    const ownerId = req.userId;

    try {
        const newProperty = new Property({
            title,
            description,
            imageUrl,
            rentAmount,
            owner: ownerId
        });
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch(error) {
        res.status(500).json({ message: 'Erro ao criar anúncio', error: error.message})
    }
}

exports.listAll = async (req, res) => {
    try {
        const properties = await Property.find({ status: 'available'}).populate('owner', 'name email')
        res.status(200).json(properties)
    } catch(error) {
        res.status(500).json({ message: 'Erro ao listar', error: error.message})
    }
}

exports.getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email')
        if (!property) return res.status(404).json({ message: 'Propriedade não encontrada'})
            res.status(200).send(property)
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

exports.updatePropertyStatus = async (req, res) => {
    const { status } = req.body;
    if (!['available', 'rented'].includes(status)) return res.status(400).json({ message: 'Status invalido'})
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { status: status},
            { new: true}
        );
        if (!property) return res.status(404).json({ message: 'Propriedade não encontrada'})
            res.status(200).json({ message: 'status da propriedade atualizado', property})
    } catch (error) {
        console.error(error.message)
        throw error
    }
}