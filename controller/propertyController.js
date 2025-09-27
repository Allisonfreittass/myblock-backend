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