const verifyToken = require('../middleware/auth');

const {addProductHandler, 
    getAllProductsHandler, 
    getProductByIdHandler, 
    deleteProductByIdHandler, 
    getTodayProductsHandler,
    registerUserHandler} = require('../handler/handler')

const routes = [
    { method: 'POST', 
      path: '/products', 
      handler: addProductHandler, 
      options: { pre: [{ method: verifyToken }] } 
    },
    { method: 'GET', 
      path: '/products', 
      handler: getAllProductsHandler, 
      options: { pre: [{ method: verifyToken }] } 
    },
    { method: 'GET', 
      path: '/products/{id}', 
      handler: getProductByIdHandler, 
      options: { pre: [{ method: verifyToken }] } 
    },
    { method: 'DELETE', 
        path: '/products/{id}', 
        handler: deleteProductByIdHandler, 
        options: { pre: [{ method: verifyToken }] } 
    },
    { method: 'GET', 
        path: '/products/today', 
        handler: getTodayProductsHandler, 
        options: { pre: [{ method: verifyToken }] } 
    },
    { method: 'POST', 
        path: '/users/register', 
        handler: registerUserHandler }, // Opsional
];


module.exports = routes;