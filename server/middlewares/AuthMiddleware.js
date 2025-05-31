import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (!token) {
        return res.status(401).json({message: "You are not authenticated!"});
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        
        // Set userId for getUserInfo function
        req.userId = decoded.userId;
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie("jwt");
        return res.status(401).json({message: "You are not authenticated!"});
    }
}
