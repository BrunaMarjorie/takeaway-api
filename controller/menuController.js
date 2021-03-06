const { ObjectID } = require('mongodb');
const menu = require('../model/menuModel')();
const validations = require('../src/validations')();

module.exports = () => {

    const getController = async (req, res) => {
        //call menuModel function;
        const Menu = await menu.get();
        if (!Menu) {
            //return if no menu found;
            return res.status(404).json({
                error: 404,
                message: 'No menu found',
            });

        } else {
            //return general list of menus;
            return res.json({ Menu });
        }
    };

    const postController = async (req, res) => {
        //check user status;
        const user = await validations.userValidation(req.user);
        if (user['status'] !== 'admin') {
            return res.status(401).json('Action not authorized.');
        }
        //collect information;
        const { number, dish, type, ingredients, allergens, price } = req.body;
        try {
            //call menuModel function;
            const { results, error } = await menu.add(number, dish, type, ingredients, allergens, price);

            if (error) {
                //return if any error is found;
                console.log(error);
                res.status(400).send({ error });
            } else {
                //return if succesfull;
                return res.send(`Menu item inserted successfull: ${dish}: ${ingredients}, allergens: ${allergens} - € ${price}`);
            }
        } catch (ex) {
            //return if any error occurs;
            console.log("=== Exception menu::add");
            return res.status(500).json({ error: ex });
        }
    };

    const deleteController = async (req, res) => {
        const id = req.params.objectID;
        let objectID;
        try {
            //check if id collected is a valid ObjectID;
            if (new ObjectID(id).toHexString() === id) {
                objectID = id;
            }
        } catch (ex) {
            //return if any error occurs;
            console.log("=== Exception menu::delete/objectID");
            return res.send(`Error: ObjectID is not valid.`);
        }
        try {
            const results = await menu.deleteData(objectID);
            //check result;
            if (results != null && results != -1) {
                //return if success;
                return res.end(`Menu item deleted successfully`);
            } else {
                //return if menu item is not on the menu;
                return res.end(`Error: Menu item not found.`);
            }
        } catch (ex) {
            //return if any error occurs;s
            console.log("=== Exception menu::delete");
            return res.status(500).json({ error: ex });
        }
    };

    const updateController = async (req, res) => {
        const id = req.params.objectID;
        let { number, dish, ingredients, allergens, price } = req.body;
        try {
            const results = await menu.updateData(id, number, dish, ingredients, allergens, price);
            //check result;
            if (error) {
                //return if any error is found;
                console.log(error);
                res.status(400).send({ error });
            } else {
                //return if succesfull;
                return res.end(`Item updated successfully`);
            }
        } catch (ex) {
            //return if any error occurs;
            console.log("=== Exception menu::update");
            return res.status(500).json({ error: ex });
        }
    };

    const searchController = async (req, res) => {
        const { search } = req.body;
        console.log(search);
        try {
            //call menuModel function with search;
            const menuSearch = await menu.get(search);
            //check results
            if (menuSearch == null) {
                // return if menu does not have search
                return res.status(404).json({
                    error: 404,
                    message: 'Menu item not found',
                });
            } else {
                // return if search exists
                res.json(menuSearch);
            }
        } catch (ex) {
            //return if any error occurs;
            console.log("=== Exception menu::search.");
            return res.status(500).json({ error: ex })
        }
    };

    return {
        getController,
        postController,
        deleteController,
        updateController,
        searchController,
    }
}