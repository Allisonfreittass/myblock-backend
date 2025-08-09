const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { email, password, walletAdress} = req.body;

    if (!email || !password  || !walletAdress) {
        return res.status(400).json({ message: 'Por favor, forneça o email e senha'})
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: 'Este email já está em uso'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User ({
            email,
            password: hashedPassword,
            walletAddress: walletAdress
        })

        await newUser.save();

        res.status(201).json({message: 'Usuario cadastrado com sucesso'})
    } catch (error) {
        console.error('Erro ao executar', error.message)
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, forneça o email e senha'})
    }

    try {
        
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Usuário não econtrado'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais invalidas'})
        }


        const payload = {
            userId: user._id,
            email: user.email
        }

        const token = jwt.sign(
            payload,
            process.env.SALT_KEY,
            { expiresIn: '1d'}
        )

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                walletAddress: user.walletAdress
            }
        })
    } catch (error) {
        console.error('Erro ao registrar', error.message)
        throw error
    }
}

exports.associateWallet = async (req, res) => {
    const { walletAddress } = req.body;
    const userId = req.userId

    if (!walletAddress) {
        return res.status(400).json({ message: 'Endereço da carteira não fornecido'})
    }
    try {
        const updateUser = await User.findByIdAndUpdate(
            userId, 
            { walletAddress: walletAddress},
            { new: true}
        ).select('-password')
        
        if (!updateUser) return res.status(400).json({ message: 'Erro ao atualizar usuário!'})

        res.status(200).json({
            message: 'Carteira associada com sucesso!',
            user: updateUser
        })
        
    } catch (error) {
        console.error('Erro ao executar', error.message)
        throw error
    }
}

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user){
            return res.status(404).json({ message: 'Usuário não encontrado'})
        }
        res.status(200).json(user)
    } catch (error) {
        console.error('Erro ao buscar perfil', error.message)
        throw error
    }
}

exports.updateProfile = async (req, res) => {
    const userId = req.userId;
    const { name, phone, zipCode } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (zipCode) updateData.zipCode = zipCode;

    if (req.file) {
        const profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        updateData.profilePictureUrl = profilePictureUrl
    }

    try {
        const updateUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {new: true}
        ).select('-password')

        if (!updateUser) return res.status(400).json({ message: 'Usuário não encontrado'})

        res.status(200).json({
            message: 'Perfil atualizado com successo',
            user: updateUser

        })
    } catch(error) {
        console.error('Erro ao atualizar', error.message)
        throw error
    }
}