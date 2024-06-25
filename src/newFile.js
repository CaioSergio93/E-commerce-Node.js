const { app } = require('.');

// Rota para listar todos os itens
app.get('/list', async (req, res) => {
    try {
        const items = await items.find();
        res.json(items); // Envia os itens como JSON
    } catch (err) {
        console.error('Erro ao recuperar itens:', err);
        res.status(500).json({ error: 'Erro ao recuperar itens' });
    }
});
