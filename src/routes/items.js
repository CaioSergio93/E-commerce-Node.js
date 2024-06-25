const express = require('express');
const router = express.Router();
const Item = require('../models/itemsModel'); // Caminho corrigido para o modelo de item

const path = require('path');

// Rota para exibir o formulário de adição de itens
router.get('/add', (req, res) => {
    res.sendFile('add-item.html', { root: path.join(__dirname, '..', 'views') }); // Caminho corrigido para add-item.html
});

// Rota para lidar com a submissão do formulário de adição de itens
router.post('/add', async (req, res) => {
    const { name, price, description } = req.body;

    try {
        const newItem = new Item({ name, price, description });
        await newItem.save();
        res.redirect('/items'); // Redireciona para a lista de itens após adicionar
    } catch (err) {
        console.error('Erro ao adicionar item:', err);
        res.status(500).send('Erro ao adicionar item');
    }
});

// Rota para listar todos os itens
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('list.html', { items }); // Utiliza res.render se estiver usando um mecanismo de template como EJS, Handlebars, etc.
    } catch (err) {
        console.error('Erro ao recuperar itens:', err);
        res.status(500).send('Erro ao recuperar itens');
    }
});

module.exports = router;
