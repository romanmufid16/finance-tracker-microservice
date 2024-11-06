import express from 'express';
import { addData, deleteData, getAll, getById, getTransactionByCategory } from '../controller/transactionController.js';
import { validateTransaction } from '../middleware/validation.js';

export const routes = express.Router();

// Route untuk mengambil data dengan query page
routes.get('/', getAll);

//Route untuk mengambil data berdasarkan ID
routes.get('/id/:id', getById);

//Route untuk mengambil data berdasarkan Category
routes.get('/category/:category', getTransactionByCategory);

//Route untuk menambahkan data
routes.post('/', validateTransaction, addData);

//Route untuk menghapus data
routes.delete('/:id', deleteData);