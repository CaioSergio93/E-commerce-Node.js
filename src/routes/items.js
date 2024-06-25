        const express = require('express');
        const router = express.Router();
        const Item = require('../models/itemsModel'); // Caminho corrigido para o modelo de item
        const multer = require('multer');
        const path = require('path');

        // Configuração do Multer para salvar arquivos no disco
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads/'); // Pasta onde os arquivos serão salvos
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo salvo
            }
        });

        const upload = multer({ storage: storage });

        // Rota para exibir o formulário de adição de itens
        router.get('/add', (req, res) => {
            res.sendFile('add-item.html', { root: path.join(__dirname, '..', 'views') }); // Caminho corrigido para add-item.html
        });

        // Rota para lidar com a submissão do formulário de adição de itens
        router.post('/add', upload.single('image'), async (req, res) => {
            try {
                // Extrair os dados do corpo da requisição
                const { name, price, description } = req.body;

                // Verificar se todos os campos obrigatórios estão presentes
                if (!name || !price || !description || !req.file) {
                    return res.status(400).send('Todos os campos são obrigatórios: name, price, description e image');
                }

                // Criar uma nova instância do modelo Item
                const newItem = new Item({
                    name,
                    price,
                    description,
                    image: req.file.filename // Nome do arquivo salvo pelo multer
                });

                // Salvar o novo item no banco de dados
                await newItem.save();

                // Responder com uma mensagem de sucesso ou redirecionar para outra página
                res.status(201).send('Item adicionado com sucesso!');
            } catch (error) {
                // Capturar e lidar com erros de validação ou do banco de dados
                console.error('Erro ao adicionar item:', error);
                res.status(400).send('Erro ao adicionar item: ' + error.message);
            }
        });

        // Rota para listar todos os itens
        router.get('/', async (req, res) => {
            try {
                const items = await Item.find();
                res.status(200).json(items); // Retorna os itens como JSON
            } catch (err) {
                console.error('Erro ao recuperar itens:', err);
                res.status(500).json({ message: 'Erro ao recuperar itens' });
            }
        });

        module.exports = router;