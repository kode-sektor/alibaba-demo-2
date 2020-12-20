import React, { useEffect } from 'react';
import './style.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCategory } from '../../actions';


const MenuHeader = (props) => {

    const category = useSelector(state => state.category);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCategory());
    }, []);


    const renderCategories = (categories) => {

        let menuCategories = [];

        for (let category of categories) {
            menuCategories.push(
                <li key={category.name}>
                {
                    category.parentId ? // Has a parent? Then its clickable
                        <a href={`/${category.slug}`}>
                        {/* <a href={`/${category.slug}?cid=${category._id}&type=${category.type}`}> */}
                            {category.name} 
                        </a> :
                    <span>{category.name}</span>    // No parent? Then its a parent itself - shouldnt be clickable
                }
                    {category.children.length > 0 ? (<ul>{renderCategories(category.children)}</ul>) : null}
                </li>
            );
        }
        return menuCategories;
    }

    return (
        <div className="menuHeader">
            <ul>
                {category.categories.length > 0 ? renderCategories(category.categories) : null}
            </ul>
        </div>
    )
}

export default MenuHeader