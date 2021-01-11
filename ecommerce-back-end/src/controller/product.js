const Product = require('../models/product');
const shortid = require('shortid');
const slugify = require('slugify');
const Category = require('../models/category');

exports.createProduct = (req, res) => {

    // console.log("REQ.BODY >>> ", req.body)

    const {
        name, price, description, category, quantity, createdBy
    } = req.body;
     
    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy: req.user._id // obtained from jwt sign-in (controller/admin/auth.js)
    });

    // if (name && price ) {
        product.save(((error, product) => {
            if (error) return res.status(400).json({ error });
    
            if (product) {
                res.status(201).json({ product });
                // console.log('worked')
            }
        }));
    // } else {
    //     return res.status(400).json({ error : "Fields are not complete"})
    // }
};

exports.getProductsBySlug = (req, res) => {
    // This catches when you click a nav menu link
    const { slug } = req.params;    // Fetch the slug from the query string (Mi-xS6R0cMRY)
    // console.log(req.params)  ==> { slug: 'Samsung-iVtkEAlTr' }
    // console.log(slug)

    Category.findOne({ slug: slug })    // Find category that holds the slug
    .select('_id name')  // Fetch its id (5f318e4277ba10307535b6)
    .exec((error, category) => {
        if (error) {
            return res.status(400).json({error});
        }
        if (category) { // Now, fetch all PRODUCTS whose CATEGORY property matches the id of the CATEGORY collection
            Product.find({ category: category._id })
            .exec((error, products) => {

                if (error) {
                    return res.status(400).json({error});
                }

                if (products.length > 0) {
                    res.status(200).json({
                        category : category.name,
                        priceRange: {
                            under5k: 5000,
                            under10k: 10000,
                            under15k: 15000,
                            under20k: 20000,
                            under30k: 30000
                        },
                        products,
                        productsByPrice: {
                            under5k: products.filter(product => product.price <= 5000),
                            under10k: products.filter(product => product.price > 5000 && product.price <= 10000),
                            under15k: products.filter(product => product.price > 10000 && product.price <= 15000),
                            under20k: products.filter(product => product.price > 15000 && product.price <= 20000),
                            under30k: products.filter(product => product.price > 20000 && product.price <= 30000)
                        }
                    });
                }
            })
        }
    });
}

exports.getProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if (productId) {
        Product.findOne({ _id: productId })
        .populate("category", "name parentId")
        .exec((error, product) => {
            if (error) return res.status(400).json({ error });

            if (product) {
                // Fetch related parent category
                Category.findOne({ parentId: product.category.parentId })
                //.select("name")
                .exec((error, parentCategory) => {
                    if (error) {
                        return res.status(400).json({error});
                    }
                    res.status(200).json({ product, parentCategory : parentCategory.name });
                })
            }
        });
    } else {
        return res.status(400).json({ error: 'Params required' });
    }
}