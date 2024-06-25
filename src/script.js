// script.js

async function loadItems() {
    try {
        const response = await fetch('/list');
        const items = await response.json();

        const itemList = document.getElementById('item-list');
        itemList.innerHTML = ''; // Limpa qualquer conteúdo pré-existente

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <p>Preço: $${item.price}</p>
                <img src="/${item.image}" alt="${item.name}"> <!-- Exibir a imagem -->
            `;
            itemList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
    }
}

window.onload = loadItems;
