import express from 'express'
import conexao from '../infra/conexao.js'
import shortid from 'shortid'

const app = express()

const PORT = 5000
app.use(express.json())

// criar rota padrao ou raiz

//mock
const selecoes = [
    { id: 1, selecao: 'Brasil', grupo: 'G' },
    { id: 2, selecao: 'Suiça', grupo: 'G' },
    { id: 3, selecao: 'Camarões', grupo: 'G' },
    { id: 4, selecao: 'Servia', grupo: 'G' }
]

app.get('/', (request, response) => {
    response.send('rota criada com sucesso!')
})


app.get('/selecoes', (request, response) => {
    // Consulta ao banco de dados
    conexao.query('SELECT * FROM selecoes', (err, result) => {
        if (err) {
            console.log(`Erro ao consultar seleções: ${err}`);
            response.status(500).send('Erro ao consultar seleções');
        } else {
            response.status(200).json(result); // Envie os dados das seleções como resposta
        }
    });
});

app.get('/selecoes/:id', (request, response) => {
    const selecaoid = request.params.id

    // Consulta ao banco de dados
    conexao.query('SELECT * FROM selecoes where id = ?', selecaoid, (err, result) => {
        if (err) {
            console.log(`Erro ao consultar seleções: ${err}`);
            response.status(500).send('Erro ao consultar seleções');
        } else {
            console.log('Seleções consultadas com sucesso');
            response.status(200).json(result); // Envie os dados das seleções como resposta
        }
    });
});

//pegar selecao por nome, enviar a selecao pelo corpo, exemplo {"selecao": "holanda"}
app.post('/selecoes/id', (request, response) => {
    const selecao = request.body.selecao
    conexao.query('select * from selecoes where selecao = ?', selecao, (err, result) => {
        if (response.status(200)) {
            response.json(result)
        }
        else {
            response.json(err)
        }
    })
})

const urlDatabase = {};

app.post('/shorten', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortId = shortid.generate();
    urlDatabase[shortId] = url;

    const shortUrl = `http://localhost:${PORT}/encurtador/${shortId}`;
    res.json({ shortUrl });
});

// Rota para redirecionar para o link original
app.get('/encurtador/:shortId', (req, res) => {
    const { shortId } = req.params;
    const originalUrl = urlDatabase[shortId];
    if (!originalUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  
    // Verificar se a URL começa com http:// ou https://
    if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://')) {
      // Se começar com http:// ou https://, redirecione diretamente para a URL externa
      res.redirect(originalUrl);
    } else {
      // Caso contrário, redirecione para a URL interna
      res.redirect(`http://${originalUrl}`);
    }
  });



export default app