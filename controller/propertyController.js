const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
  try {
    const location = JSON.parse(req.body.location);
    const details = JSON.parse(req.body.details);
    const rules = JSON.parse(req.body.rules);
    const fees = JSON.parse(req.body.fees);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
    }
    
    const imageUrls = req.files.map(file => 
      `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );

    const newProperty = new Property({
      title: req.body.title,
      description: req.body.description,
      ownerWalletAddress: req.body.ownerWalletAddress,
      owner: req.user.userId,
      imageUrls, 
      location,
      details,
      rules,
      fees,
    });

    await newProperty.save();
    res.status(201).json(newProperty);

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Erro ao criar propriedade', error: error.message });
  }
};

exports.listAll = async (req, res) => {
    try {
        const properties = await Property.find({ status: 'available'}).populate('owner', 'name email')
        res.status(200).json(properties)
    } catch(error) {
        res.status(500).json({ message: 'Erro ao listar', error: error.message})
    }
}

exports.listByOwner = async (req, res) => {
  try {
    const userId = req.user.userId
    const properties = await Property.find({ owner: userId}).populate('owner', 'name email')

    res.status(200).send(properties)
  } catch (error) {
    console.log(error)
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

exports.updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user.userId;
    const propertyToUpdate = await Property.findById(propertyId);
    if (!propertyToUpdate) {
      return res.status(404).json({ message: 'Propriedade não encontrada.' });
    }

    if (propertyToUpdate.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Você não é o proprietário deste imóvel.' });
    }
    
    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      location: JSON.parse(req.body.location),
      details: JSON.parse(req.body.details),
      rules: JSON.parse(req.body.rules),
      fees: JSON.parse(req.body.fees),
    };

    if (req.files && req.files.length > 0) {
      updatedData.imageUrls = req.files.map(file => 
        `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      );
    }
    
    const updatedProperty = await Property.findByIdAndUpdate(propertyId, updatedData, { new: true });

    res.status(200).json({ message: 'Propriedade atualizada com sucesso!', property: updatedProperty });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar propriedade', error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.user.userId;

    const propertyToDelete = await Property.findById(propertyId);
    if (!propertyToDelete) {
      return res.status(404).json({ message: 'Propriedade não encontrada.' });
    }

    if (propertyToDelete.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    await Property.findByIdAndDelete(propertyId);

    res.status(200).json({ message: 'Propriedade excluída com sucesso!' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir propriedade', error: error.message });
  }
};

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