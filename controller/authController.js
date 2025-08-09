const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password ) {
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
            password: hashedPassword
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
                walletAdress: user.walletAdress
            }
        })
    } catch (error) {
        console.error('Erro ao registrar', error.message)
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