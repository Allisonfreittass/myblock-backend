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