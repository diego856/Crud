const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {products : products})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const IdProducto = req.params.id;
		const ProductoEncontrado = products.find(producto => producto.id == IdProducto);
		res.render('detail', {ProductoEncontrado: ProductoEncontrado})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const UltimoProducto = products.length
		const IdUltimoProducto = products[UltimoProducto-1].id

		const NuevoProducto = {
			id: (IdUltimoProducto + 1),
  			name: req.body.name,
  			description: req.body.description,
  			price: req.body.price,
  			discount: req.body.discount,
  			category: req.body.category,
			image: req.file ? req.file.filename : 'img-rick-morty.jpg'
		}
		
		products.push(NuevoProducto)

		const fileContents = JSON.stringify(products, null, " ");
            fs.writeFileSync(productsFilePath, fileContents);

		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const IdProducto = req.params.id;
		const productToEdit = products.find(producto => producto.id == IdProducto);
		res.render('product-edit-form', {productToEdit: productToEdit})
	},
	// Update - Method to update
	update: (req, res) => {
		const IdProducto = req.params.id;
		const productoFiltrado = products.filter(producto => producto.id == IdProducto)
		const keepImage = productoFiltrado[0].image
		console.log(productoFiltrado);
		console.log('La imagen tiene ruta ' + keepImage);
		const ProductoModificado = {
			id: IdProducto,
  			name: req.body.name,
  			description: req.body.description,
  			price: req.body.price,
  			discount: req.body.discount,
  			category: req.body.category,
			image: req.file ? req.file.filename : keepImage
		}
				
		const updateRow = products.map(oneProduct => {
			if(oneProduct.id == ProductoModificado.id){
				return ProductoModificado;
			}
			return oneProduct
		})

		const fileContents = JSON.stringify(updateRow, null, " ");
			fs.writeFileSync(productsFilePath, fileContents)

		res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const IdProducto = req.params.id;

		const productoEliminado = products.filter(productos => productos.id != IdProducto)

		const fileContents = JSON.stringify(productoEliminado, null, " ");
			fs.writeFileSync(productsFilePath, fileContents)

		res.redirect('/products')
	}
};

module.exports = controller;