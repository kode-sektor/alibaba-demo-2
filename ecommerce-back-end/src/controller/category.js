const Category = require('../models/category');
const slugify = require('slugify');

// shortid is important to always create a unique slug for MongoDB. 
// Because without it, if you delete any record, you can't create a 
// new record with the old name again

const shortid = require('shortid'); 


// Fetch all categories
exports.getCategories = (req, res) => {
    
    Category.find({})
    .exec((error, categories) => {
        if (error) {
            console.log(error)
            return res.status(400).json({ error })
        }
        if (categories) {   
            // console.log ("Categories >>> ", categories)

            // [ { _id: '5fc2f39e7fa915b3e45a9a57',
            //     name: 'Electronics',
            //     slug: 'Electronics',
            //     type: '',
            //     categoryImage: '',
            //     parentId: '',
            //     children: [ '' ] },
            //        ...
            // ]
                
            // return an object (list) of categories and passes for filter
            const categoryList = createCategories(categories);  
            // console.log("categoryList >>> ", categoryList)

            res.status(200).json({categoryList})
        }
    });
}

function createCategories (categories, parentId = null) {

    const categoryList = [];
    let category;

    if (parentId == null) { 
        category = categories.filter(cat => cat.parentId == undefined);
    } else {
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id)    // If no parent, the else clause will return nothing, 
                                                                // thus for loop cannot run on nothing. Hence, category 
                                                                // will return no filtered array which means this for loop
                                                                // won't run deeper. So the fear of an infinite loop is 
                                                                // elimninated

                                                                // So in other words, it runs only 1-nested level max because if you
                                                                // think about it, in the MongoDB, all records are straight.
        });
    }
    return categoryList;
}

// Add category to DB
exports.addCategory = (req, res) => {

    // console.log("REQ.BODY >>> ", req.body)
    // console.log("REQ.FILE >>> ", req.file)

    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}` // Mi-xS6R0cMRY
    }

    if (req.file) {
        categoryObj.categoryImage = process.env.API + '/public/' + req.file.filename;
    }

    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);

    cat.save((error, category) => {
        if (error) return res.status(400).json({ error });
        if (category) {
            console.log('Category inserted >>> ', category)
            return res.status(201).json({ category });
        }
    });
}

exports.updateCategories = async (req, res) => {

    const {_id, name, parentId, type} = req.body;
    const updatedCategories = [];

    // console.log("category.js : REQ >>> ", req.body)

//     _id: [ 
//             '5fc2f39e7fa915b3e45a9a57',
//             '5fcf0c1600b49073b48420be',
//             '5fcf130200b49073b48420c1',
//             '5fcf130d00b49073b48420c2' 
//         ],
//    name: [ 'Electronics', 'Mobiles', 'Samsunggg', 'Iphone' ],
//    parentId: [ 
//             '',
//             '5fc2f39e7fa915b3e45a9a57',
//             '5fcf0c1600b49073b48420be',
//             '5fcf0c1600b49073b48420be'
//         ] 
//     }

    if (name instanceof Array) {    // If more than 1 entry from form, loop and update

        for (let i=0; i < name.length; i++) {
            // 'category' is an object to be passed to the DB. It contains the values
            const category = {
                name: name[i],
                type: type[i]
            };
            // If parentId is not empty, add it to the object
            if (parentId[i] !== "") {
                category.parentId = parentId[i];
            }

            // Update on every loop
            const updatedCategory =  await Category.findOneAndUpdate({_id: _id[i]}, category, {new: true});
            updatedCategories.push(updatedCategory);    // Return updated records
        }
        return res.status(201).json({ updateCategories: updatedCategories });

    } else {    // If only 1 entry, simply update

        const category = {
            name,
            type
        };
        if (parentId !== "") {
            category.parentId = parentId;
        }
        const updatedCategory =  await Category.findOneAndUpdate({_id}, category, {new: true});
        return res.status(201).json({ updatedCategory });
    }
}

exports.deleteCategories = async (req, res) => {
    // req.body.payload because 'payload' was the key used to pass in the data from axios 
    // from actions file
    const { ids } = req.body.payload;   
    // console.log("category.js >>> ", req.body.payload)

    const deletedCategories = [];   // Save records of deleted categories

    for (let i=0; i < ids.length; i++) {
        const deleteCategory = await Category.findOneAndDelete({ _id: ids[i]._id });
        deletedCategories.push(deleteCategory);
    }

    // If length of deleted categories is the same as what you began with (req.body.payload.length)
    // then deletion was successful
    if (deletedCategories.length == ids.length) {
        res.status(201).json({message: 'Categories removed'});
    } else {
        res.status(400).json({message: 'Something went wrong'});
    }
}
