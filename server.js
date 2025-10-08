const express = require('express')
const app = express()
const port = 3000;

app.use(express.json())

let carros = [
    { id: 1, marca: "Volkswagen", modelo: "Jetta", ano: "2025", preco },
    { id: 2, marca: "Honda", modelo: "Civic", ano: "2023", },
    { id: 3, marca: "Peugeot", modelo: "206", ano: "2008", },
];

let proximoId = 4;

app.get('/carros', (req, res) => {
    res.json(carros)
})

app.post(
    '/carros', (req, res) => {
        const { modelo, marca, ano, preco } = req.body;
        if (!modelo || !marca || !ano || !preco) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const novoCarro = {id: proximoId++, modelo, marca, ano, preco};
        carros.push(novoCarro);
        res.status(201).json(novoCarro)
    })

    
app.put('/carros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { modelo, marca, ano, preco } = req.body;

    const carro = carros.find(p => p.id === id);

    if (!carro) {
        return res.status(404).json({ error: 'Carro não encontrado.' });
    }

    if (modelo) carro.modelo = modelo;
    if (marca) carro.marca = marca;
    if (ano) carro.ano = ano;
    if (preco) carro.preco = preco;

    res.json(carro);
});

app.delete(
    '/pessoas/:id',
    (req, res) => {
        const id = parseInt(req.params.id)
        const index = pessoas.findIndex(p => p.id === id)

        if (index !== -1) {
            const pessoaDeletada = pessoas.splice(index, 1)
            res.json(pessoaDeletada[0])
        } else {
            res.status(404).json({ error: "pessoa não encontrada." })
        }
    }
)

app.get(
    '/pessoas/:id',
    (req, res) => {
        const id = parseInt(req.params.id);
        const pessoa = pessoas.find(p => p.id === id);

        if (pessoa) {
            res.json(pessoa);
        } else {
            res.status(404).json({ error: 'Pessoa não encontrada.' });
        }
    }
)

app.listen(port, () => {
    console.log(`Servido em execução: http://localhost:${port}`);
})
