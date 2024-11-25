const data = require('../database/database');
const Joi = require('@hapi/joi');

// Tambah produk baru
const addProductHandler = async (request, h) => {
    const { userId } = request.auth;
    const { namaProduct, valueProduct } = request.payload;

    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        const [result] = await data.query(
            'INSERT INTO products (userId, namaProduct, valueProduct, createdAt) VALUES (?, ?, ?, ?)',
            [userId, namaProduct, valueProduct, createdAt]
        );

        return h.response({
            status: 'success',
            message: 'Product added successfully',
            data: { id: result.insertId },
        }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ status: 'fail', message: 'Failed to add product' }).code(500);
    }
};


// Ambil semua produk
const getAllProductsHandler = async (request, h) => {
    const { userId } = request.auth;

    try {
        const [rows] = await data.query(
            'SELECT * FROM products WHERE userId = ? ORDER BY createdAt DESC',
            [userId]
        );

        return h.response({
            status: 'success',
            data: { products: rows },
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ status: 'fail', message: 'Failed to fetch products' }).code(500);
    }
};



// Ambil produk berdasarkan ID
const getProductByIdHandler = async (request, h) => {
    const { userId } = request.auth;
    const { id } = request.params;

    try {
        const [rows] = await data.query(
            'SELECT * FROM products WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (rows.length === 0) {
            return h.response({
                status: 'fail',
                message: 'Product not found',
            }).code(404);
        }

        return h.response({
            status: 'success',
            data: { product: rows[0] },
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ status: 'fail', message: 'Failed to fetch product' }).code(500);
    }
};


// Hapus produk berdasarkan ID
const deleteProductByIdHandler = async (request, h) => {
    const { userId } = request.auth;
    const { id } = request.params;

    try {
        const [result] = await data.query(
            'DELETE FROM products WHERE id = ? AND userId = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return h.response({
                status: 'fail',
                message: 'Product not found',
            }).code(404);
        }

        return h.response({
            status: 'success',
            message: 'Product deleted successfully',
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ status: 'fail', message: 'Failed to delete product' }).code(500);
    }
};


// Ambil produk yang ditambahkan hari ini
const getTodayProductsHandler = async (request, h) => {
    const { userId } = request.auth;
    const today = new Date().toISOString().split('T')[0];

    try {
        const [rows] = await data.query(
            'SELECT * FROM products WHERE userId = ? AND DATE(createdAt) = ?',
            [userId, today]
        );

        return h.response({
            status: 'success',
            data: { products: rows },
        }).code(200);
    } catch (error) {
        console.error(error);
        return h.response({ status: 'fail', message: 'Failed to fetch today\'s products' }).code(500);
    }
};


const registerUserHandler = async (request, h) => {
    const { userId, email, name } = request.payload;

    try {
        await data.query(
            'INSERT INTO users (id, email, name) VALUES (?, ?, ?)',
            [userId, email, name]
        );

        return h.response({
            status: 'success',
            message: 'User registered successfully',
        }).code(201);
    } catch (error) {
        console.error(error);
        return h.response({ status: 'fail', message: 'Failed to register user' }).code(500);
    }
};



module.exports = {
    addProductHandler,
    getAllProductsHandler,
    getProductByIdHandler,
    deleteProductByIdHandler,
    getTodayProductsHandler,
    registerUserHandler
};
