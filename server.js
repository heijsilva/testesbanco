const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

// Requerendo os modelos
const Pet = require('./models/pets');
const Usuario = require('./models/usuarios');
const Raca = require('./models/racas');

const app = express();
const port = process.env.PORT || 3333;

// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json());

// Permitir solicitações de diferentes origens
app.use(cors());

// Middleware para servir arquivos estáticos da pasta 'public' (onde estará o index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para listar todos os pets
app.get('/api/pets', async (req, res) => {
    try {
        const pets = await Pet.find()
            .populate('raca')  // Populando a referência de 'raca'
            .populate('id_ong');  // Populando a referência de 'id_ong'
        res.json(pets);  // Retorna os pets em formato JSON
    } catch (err) {
        console.error('Erro ao buscar os pets:', err);
        res.status(500).send('Erro ao buscar os pets.');
    }
});

// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

// Rota para cadastro de usuários (incluindo criptografia de senha)
app.post('/api/usuarios', async (req, res) => {
    const { nome, email, telefone, senha, tipo_usuario, adotante_info } = req.body;  // agora inclui adotante_info

    try {
        // Verifica se o usuário já existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Usuário já existe com esse email' });
        }

        // Criptografar a senha
        const salt = bcrypt.genSaltSync(10);
        const senhaHash = bcrypt.hashSync(senha, salt);

        // Criar novo usuário com adotante_info incluído
        const novoUsuario = new Usuario({
            nome,
            email,
            telefone,
            senha: senhaHash,  // Salvar a senha criptografada
            tipo_usuario,
            adotante_info, // Incluindo adotante_info na criação do usuário
        });

        // Salvar no banco de dados
        await novoUsuario.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

// Rota de login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado' });
        }

        // Comparando a senha fornecida com a senha criptografada no banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (senhaCorreta) {
            return res.status(200).json({ success: true, message: 'Login bem-sucedido' });
        } else {
            return res.status(400).json({ success: false, message: 'Senha incorreta' });
        }
    } catch (err) {
        console.error('Erro ao autenticar usuário:', err);
        return res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});
