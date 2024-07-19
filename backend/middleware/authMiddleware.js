const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({ error: 'Token is invalid' });
//             }
//             req.user = decoded;
//             next();
//         });
//     } else {
//         res.status(401).json({ error: 'Token is required' });
//     }
// }

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token is invalid' });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ error: 'Token is required' });
    }
}

module.exports = auth;