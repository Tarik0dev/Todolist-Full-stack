
const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    try {
   
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({ message: "Token manquant" });}

        const token = header.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.auth = {userId: decodedToken.userId,role: decodedToken.role, firstName: decodedToken.firstname, lastName: decodedToken.lastname  };
 
        next();
    } catch (error) {

        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};
module.exports = authMiddleware;