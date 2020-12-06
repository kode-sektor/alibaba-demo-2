import { categoryConstants } from "../actions/constants";

const initState = {
    categories: [],
    loading: false,
    error: null
};

const buildNewCategories = (parentId, categories, category) => {
    // parentId = parentId of most recent added category
    // categories = state of all categories objects
    // category = most recent category object

    let myCategories = [];

    // If no parent, simply add to old categories (first-level)
    if (parentId == undefined) {
        return [
            ...categories,
            {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                type: category.type,
                children: []
            }
        ];
    }
    
    // However if a parent exists, loop through old categories to check if 
    // recently added category shares the same id with an existing one.
    
    for (let cat of categories) {
        console.log(cat)    // check if nested record (children) is counted

        // If the recent category id matches parentId, then it's a child of the 
        // parent, thus, should be inserted in the children array of the parent

        if (cat._id == parentId) {
            alert("A match : ", cat._id)
            const newCategory = {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                parentId: category.parentId,
                type: category.type,
                children: []
            };
            myCategories.push({
                ...cat,
                children: cat.children.length > 0 ? [...cat.children, newCategory] : [newCategory]
            })
        } else {   
            // This will run for each loop but at least one (which is the one that matches a parent, if at all there is)
            // If there is children, you want to instead, loop through the children list to check if there's a match,
            // otherwise return [] which was always the default value anyways

            myCategories.push({
                ...cat,
                children: cat.children ? buildNewCategories(parentId, cat.children, category) : []
            });
        }
    }
    return myCategories;
}

export default (state = initState, action) => {

    switch (action.type) {
        
        case categoryConstants.GET_ALL_CATEGORIES_SUCCESS :
            state = {
                ...state,
                categories: action.payload.categories
            }
            console.log(state)
        break;
        case categoryConstants.ADD_NEW_CATEGORY_REQUEST :
            state = {
                ...state,
                loading: true
            }
        break;
        case categoryConstants.ADD_NEW_CATEGORY_SUCCESS :
            const category = action.payload.category;
            const updatedCategories = buildNewCategories(category.parentId, state.categories, category);
            // console.log('updated categories', updatedCategories);
            
            state = {
                ...state,
                categories: updatedCategories,
                loading: false,
            }
        break;
        case categoryConstants.ADD_NEW_CATEGORY_FAILURE :
            state = {
                ...initState,
                loading: false,
                error: action.payload.error
            }
        break;
        // case categoryConstants.UPDATE_CATEGORIES_REQUEST :
        //     state = {
        //         ...state,
        //         loading: true
        //     }
        // break;
        // case categoryConstants.UPDATE_CATEGORIES_SUCCESS :
        //     state = {
        //         ...state,
        //         loading: false
        //     }
        // break;
        // case categoryConstants.UPDATE_CATEGORIES_FAILURE:
        //     state = {
        //         ...state,
        //         error: action.payload.error,
        //         loading: false
        //     }
        // break;
        // case categoryConstants.DELETE_CATEGORIES_REQUEST :
        //     state = {
        //         ...state,
        //         loading: true
        //     }
        // break;
        // case categoryConstants.DELETE_CATEGORIES_SUCCESS :
        //     state = {
        //         ...state,
        //         loading: false
        //     }
        // break;
        // case categoryConstants.DELETE_CATEGORIES_FAILURE :
        //     state = {
        //         ...state,
        //         loading: false,
        //         error: action.payload.error
        //     }
        // break;
    }
    return state;
}