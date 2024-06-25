const Item = require('../models/ItemModel');

const itemController = {
    getAllItems: async (req, res) => {
        try {
            const items = await Item.find();
            res.render('list.html', { items }); // Exemplo de renderização usando um template engine
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
            res.status(500).send('Erro ao buscar itens');
        }
    },

    addItem: async (req, res) => {
        const { name, price, description } = req.body;
        try {
            const newItem = new Item({ name, price, description });
            await newItem.save();
            res.redirect('/items'); // Redireciona para a lista de itens após adicionar
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            res.status(500).send('Erro ao adicionar item');
        }
    },

    getAddItemForm: (req, res) => {
        res.sendFile('add-item.html', { root: './src/views' });
    }
};

module.exports = itemController;
    