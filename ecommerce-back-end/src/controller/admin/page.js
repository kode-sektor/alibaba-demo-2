const Page = require("../../models/page")

exports.createPage = (req, res) => {

    const { banners, products } = req.files;
	
	// banners and products come in from form submission as image objects
	// Break it down into the image path and address URL query
	if (banners && banners.length > 0) {
		req.body.banners = banners.map((banner, index) => ({
			img: `/public/${banner.filename}`,
			navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
		}));
    }
    
	if (products && products.length > 0) {
		req.body.products = products.map((product, index) => ({
			img: `/public/${product.filename}`,
			navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
		}));
	}

	// User id obtained during jwt verification should be used for author who created it
	req.body.createdBy = req.user._id;	

	// If category for page already exists, update otherwise make new save
	Page.findOne({ category: req.body.category }).exec((error, page) => {
		if (error) return res.status(400).json({ error });

		if (page) {
			Page.findOneAndUpdate({ category: req.body.category }, req.body).exec(
				(error, updatedPage) => {
					if (error) return res.status(400).json({ error });
					if (updatedPage) {
						return res.status(201).json({ page: updatedPage });
					}
				}
			);
		} else {
			const page = new Page(req.body);

			page.save((error, page) => {
                if (error) return res.status(400).json({ error });
                
				if (page) {
					return res.status(201).json({ page });
				}
			});
		}
	});
};

// Fetch page
exports.getPage = (req, res) => {

	const { category, type } = req.params;
	console.log("/ADMIN/PAGE.JS -- REQ PARAMS", req.params)
    
	if (type === "page") {
		Page.findOne({ category: category }).exec((error, page) => {
			if (error) { 
				console.log('PAGE NOT WORKING')
				return res.status(400).json({ error })
			} ;
			if (page) {
				console.log('page working')
				console.log(page)
				return res.status(200).json({ page })
			};
		});
	}
};
