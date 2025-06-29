const { getUser } = require('../service/auth')
function LoginedUser(req, res, next) {
    try {
        const token = req.cookies?.token;
        const user = getUser(token)        
        if (!token || !user) return res.redirect('/login')
        next()
    } catch (error) {
        console.log(`auth : ${error}`);
    }
}


module.exports = LoginedUser;