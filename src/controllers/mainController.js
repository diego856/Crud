const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		res.render('index', {products : products})
	},
	search: (req, res) => {
		const busqueda = req.query.keywords
		let productsFilter = products

		if(busqueda){
			productsFilter = products.filter(producto =>  
				producto.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(busqueda.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()))
				if(!productsFilter.length){
					productsFilter = undefined;
				}
		}
	
		res.render('results', {productsFilter: productsFilter, busqueda})
	},
};

module.exports = controller;
