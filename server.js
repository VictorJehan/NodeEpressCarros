const express = require('express')
const app = express()
const port = 3000;

app.use(express.json())

let carros = [
    { id: 1, marca: "Volkswagen", modelo: "Jetta", ano: "2025", preco: 130000 },
    { id: 2, marca: "Honda", modelo: "Civic", ano: "2023", preco: 110000 },
    { id: 3, marca: "Peugeot", modelo: "206", ano: "2008", preco: 18000 },
];

let proximoId = 4;

app.get('/carros', (req, res) => {
    res.json(carros);
});

app.get('/carros/filtro', (req, res) => {
    const marca = req.query.marca;

    if (!marca) {
        return res.status(400).json({ error: 'Parâmetro "marca" é obrigatório.' });
    }

    const filtrados = carros.filter(c => 
        c.marca.toLowerCase() === marca.toLowerCase()
    );

    res.json(filtrados);
});

app.get('/carros/qtd', (req, res) => {
    res.json({ quantidade: carros.length });
});

app.get('/carros/primeiro', (req, res) => {
    if (carros.length === 0) return res.status(404).json({ error: 'Nenhum carro cadastrado.' });
    res.json(carros[0]);
});

app.get('/carros/ultimo', (req, res) => {
    if (carros.length === 0) return res.status(404).json({ error: 'Nenhum carro cadastrado.' });
    res.json(carros[carros.length - 1]);
});

app.get('/carros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const carro = carros.find(c => c.id === id);

    if (carro) {
        res.json(carro);
    } else {
        res.status(404).json({ error: 'Carro não encontrado.' });
    }
});

app.post('/carros', (req, res) => {
    const { modelo, marca, ano, preco } = req.body;
    if (!modelo || !marca || !ano || preco === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const precoNum = Number(preco);
    if (isNaN(precoNum)) {
        return res.status(400).json({ error: 'Preço deve ser um número válido.' });
    }

    const novoCarro = { id: proximoId++, modelo, marca, ano, preco: precoNum };
    carros.push(novoCarro);
    res.status(201).json(novoCarro);
});

app.put('/carros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { modelo, marca, ano, preco } = req.body;

    const carro = carros.find(c => c.id === id);

    if (!carro) {
        return res.status(404).json({ error: 'Carro não encontrado.' });
    }

    if (modelo) carro.modelo = modelo;
    if (marca) carro.marca = marca;
    if (ano) carro.ano = ano;

    if (preco !== undefined) {
        const precoNum = Number(preco);
        if (isNaN(precoNum)) {
            return res.status(400).json({ error: 'Preço deve ser um número válido.' });
        }
        carro.preco = precoNum;
    }

    res.json(carro);
});

app.delete('/carros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = carros.findIndex(c => c.id === id);

    if (index !== -1) {
        const carroDeletado = carros.splice(index, 1);
        res.json(carroDeletado[0]);
    } else {
        res.status(404).json({ error: 'Carro não encontrado.' });
    }
});

app.post('/carros/lote', (req, res) => {
    const novosCarros = req.body;

    if (!Array.isArray(novosCarros)) {
        return res.status(400).json({ error: 'Deve enviar um array de carros.' });
    }

    const carrosCriados = [];

    for (let dados of novosCarros) {
        const { modelo, marca, ano, preco } = dados;

        if (!modelo || !marca || !ano || preco === undefined) {
            continue; 
        }

        const precoNum = Number(preco);
        if (isNaN(precoNum)) {
            continue;
        }

        const novo = { id: proximoId++, modelo, marca, ano, preco: precoNum };
        carros.push(novo);
        carrosCriados.push(novo);
    }

    res.status(201).json(carrosCriados);
});

app.get('/carros/estatisticas', (req, res) => {
    if (carros.length === 0) {
        return res.status(404).json({ error: 'Nenhum carro cadastrado.' });
    }

    const precos = carros.map(c => c.preco);

    const total = precos.reduce((soma, preco) => soma + preco, 0);
    const media = total / carros.length;

    res.json({
        totalCarros: carros.length,
        precoMedio: media.toFixed(2),
        precoMinimo: Math.min(...precos),
        precoMaximo: Math.max(...precos),
    });
});

app.listen(port, () => {
    console.log(`Servidor em execução: http://localhost:${port}`);
});
