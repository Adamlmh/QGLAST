const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

// 注册模块
exports.create = (req, res) => {
  let status;
  if (req.body.usertype === '1') {
    status = '用户';
  } else {
    status = '管理员';
  }

  // 先查询后创建
  User.findOne({ where: { username: req.body.username, usertype: req.body.usertype } })
    .then(existingUser => {
      if (existingUser) {
        console.log(128);
        // User already exists, send 408 status code
        return res.status(410).send({message:`该${status}已存在`});
      } else {
        // User does not exist, create a new user
        return User.create({
          username: req.body.username,
          password: req.body.password,
          usertype: req.body.usertype
        });
      }
    })
    .then(newUser => {
      console.log(newUser.dataValues);
      const data = newUser.dataValues;
//send里面要传入一个对象 否则无法被解析
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({message:`${err}`});
    });
};



// 登录查询
exports.findOne = (req, res) => {
let status;
if(req.body.usertype==='1'){
status='用户'
}else{
  status='管理员'
}
  User.findOne({where:{username:req.body.username,usertype: req.body.usertype}}).then(data => {

      if (data) {
        if(data.password===req.body.password){
        res.send(data);
        }
else{
         res.status(403).send({
          message: `密码错误请重新输入`
        }); 
}
      } else {
        res.status(404).send({
          message: `该${status}还未注册，请先注册`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: `${err}`
      });
    });
};