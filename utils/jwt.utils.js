require('dotenv').config();
const jwt = require('jsonwebtoken');
const Shop = require('../Models/shop.model');
const secret = process.env.JWT_TOKEN || 'T7&3#r45%21E945$8#@90k3#9!1O890MI';
const expiresIn = process.env.JWT_EXPIRY || '30d';


/**
 * Generate signed JWT token
 * @param {object} user 
 * @returns {string} - Signed JWT token
 */
const generateToken = (user) => {
    try {
        if (!secret) throw new Error("JWT secret not found");

        // data to assign
        let data;
        if (user.role == 'seller') {
            data = {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                shopId: user.shop
            }
        } else {
            data = {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }

        // generate token
        const token = jwt.sign(data, secret, {
            expiresIn
        });

        return token;
    } catch (error) {
        console.log("generate token failed:", error);
        throw new Error(error.message);
    }
};

/**
 * verify token
 * @param {object} req
 * @param {object} res
 * @param {Function}next 
 * @returns {object} - Signed JWT token
 */
function verifyToken(req, res, next) {
    const token = req.cookies.jwt || req.headers['authorization'];
    
    if (!token) {
        return res.status(403).send({msg:'invalid user', status:'missing token'});
    }
    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({msg:'Invalid token ! please login again', status:'missing token'});
        }

        if (decoded.role == 'seller') {
            req.shop = {
                shopId: decoded.shopId
            }
        }

        req.user = decoded;
        next();
    });
}



module.exports = {
    generateToken,
    verifyToken
}