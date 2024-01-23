const db = require('../helper/db.connection');
const models = require('../model/brand_category.model');

const getTableItems = async (req, res, tableName, Model) => {
    try {
        let columns = ['id', 'name'];
        
        if (['brands', 'categories'].includes(tableName)) {
            columns.push('imageUrl');
        }

        const query = `SELECT ${columns.join(',')} FROM ${tableName}`;
        const items = await db.query(query);

        const data = items.map(row => new Model(row));

        res.status(200).json({ message: `Get all ${tableName}`, data });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            error: 'Something went wrong',
        });
    }
};

const getBrands = async (req, res) => {
    await getTableItems(req, res, 'brands', models.Brand);
};

const getCategories = async (req, res) => {
    await getTableItems(req, res, 'categories', models.Category);
};

const getSizeItems = async (req, res) => {
    await getTableItems(req, res, 'size', models.Size);
};

const getStitchItems = async (req, res) => {
    await getTableItems(req, res, 'stitching', models.Stitching);
};

const getLiningItems = async (req, res) => {
    await getTableItems(req, res, 'linings', models.Lining);
};

module.exports = {
    getBrands,
    getCategories,
    getSizeItems,
    getStitchItems,
    getLiningItems,
};
