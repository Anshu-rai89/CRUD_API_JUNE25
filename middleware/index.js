const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports.verifyToken = async (req, res, next) => {
    try{
        const token = req.headers.authorization;
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("User payload", payload);
        next();
    }catch(error) {
        return res.status(403).json({
            msg: "You are unauthorized."
        })
    }
}