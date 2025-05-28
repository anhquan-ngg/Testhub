import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    console.log('Checking cookies:', req.cookies);
    const token = req.cookies.jwt;
    
    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({message: "You are not authenticated!"});
    }
    
    try {
        console.log('🔑 Verifying token:', token.substring(0, 20) + '...');
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log('Token verified, user:', decoded);
        
        // Set userId for getUserInfo function
        req.userId = decoded.userId;
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification failed:', error.message);
        res.clearCookie("jwt");
        return res.status(401).json({message: "You are not authenticated!"});
    }
}
