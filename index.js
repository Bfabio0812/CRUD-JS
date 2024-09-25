const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado correctamente a la base de datos'))
.catch(err => console.error('Error al conectar a la base de datos:', err));

// Definir el esquema del libro y crear el modelo
const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    edad: Number // Nuevo campo agregado
});

const Libro = mongoose.model('Libro', libroSchema);

// Ruta POST para crear un libro
app.post('/libros', async (req, res) => {
    try {
        const nuevoLibro = new Libro({
            titulo: req.body.titulo,
            autor: req.body.autor,
            edad: req.body.edad
        });
        const libroGuardado = await nuevoLibro.save();
        res.status(201).json(libroGuardado);
    } catch (error) {
        console.error('Error al crear el libro', error);
        res.status(500).json({ error: 'Error al crear el libro' });
    }
});

// Ruta GET para obtener todos los libros
app.get('/libros', async (req, res) => {
    try {
        const libros = await Libro.find();
        res.json(libros);
    } catch (error) {
        console.error('Error al obtener los libros:', error);
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
});

// Servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
//crea una peticion get, obtener el libro por el id
app.get('/libros/:id', async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);
        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json(libro);
    } catch (error) {
        console.error('Error al obtener el libro:', error);
        res.status(500).json({ error: 'Error al obtener el libro' });
    }
});

// Servir el frontend.js (código del cliente)
app.get('/frontend.js', (req, res) => {
    res.sendFile(__dirname + '/frontend.js');
});

// Ruta DELETE para eliminar un libro por id
app.delete('/libros/:id', async (req, res) => {
    try {
        const deletedLibro = await Libro.findByIdAndDelete(req.params.id);
        if (!deletedLibro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json({ message: 'Libro eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
        res.status(500).json({ error: 'Error al eliminar el libro' });
    }
});

// Ruta PUT para actualizar un libro por id
app.put('/libros/:id', async (req, res) => {
    try {
        const libroActualizado = await Libro.findByIdAndUpdate(req.params.id, {
            titulo: req.body.titulo,
            autor: req.body.autor,
            edad: req.body.edad
        }, { new: true });
        if (!libroActualizado) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json(libroActualizado);
    } catch (error) {
        console.error('Error al actualizar el libro:', error);
        res.status(500).json({ error: 'Error al actualizar el libro' });
    }
});



app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});



