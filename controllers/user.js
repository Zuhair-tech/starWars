const User = require('../models/user');

module.exports.getRegisterForm = (req,res)=>{
    res.render('users/register')
}

module.exports.newUser = async(req,res)=>{
    try{
        const{ username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err =>{
            if(err) return next(err);
            res.redirect('/arts');
        })        
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }    
}

module.exports.logout = (req,res)=>{
    req.logout();
    res.redirect('/')
}

module.exports.demo = (req,res)=>{
    res.render('demo')
}