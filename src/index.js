const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const itemRoutes = require('./routes/items');

dotenv.config();

const app = express();
exports.app = app;

// Configuração do Express para usar EJS como engine de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurações adicionais
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conectado ao banco de dados');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados', error);
        process.exit(1);
    }
};

connectDB();

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');
});

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Somente imagens são permitidas!'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Rotas
app.use('/items', itemRoutes);

// Rota inicial para a página de itens
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota para exibir formulário de adicionar item
app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add-item.html'));
});

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'list.html'));
});

// Rota para lidar com o envio do formulário de adicionar item
app.post('/items/add', upload.single('image'), async (req, res) => {
    try {
        // Extrair os campos do corpo da requisição
        const { name, price, description } = req.body;

        // Verificar se todos os campos necessários foram enviados
        if (!name || !price || !description) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios: nome, preço, descrição' });
        }

        // Criar um novo item com os dados recebidos
        const newItem = new Item({
            name,
            price,
            description,
            image: req.file.path // Caminho do arquivo de imagem no servidor
        });

        // Salvar o novo item no banco de dados
        await newItem.save();

        // Retornar uma resposta de sucesso
        res.status(201).json({ message: 'Item adicionado com sucesso!', item: newItem });
    } catch (error) {
        // Capturar e retornar erros de validação do Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Erro de validação', errors });
        }
        console.error('Erro ao adicionar item:', error);
        res.status(500).json({ message: 'Erro ao adicionar item' });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
