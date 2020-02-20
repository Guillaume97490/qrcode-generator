const controller = {};
let Exo = require('../models/exo');
const validator = require('validator');
const paginate = require('express-paginate');
const QRCode = require('qrcode');


controller.index = async (req, res, next) => {
    try {
        const [ results, itemCount ] = await Promise.all([
            Exo.find({}).limit(req.query.limit).skip(req.skip).lean().exec(),
            Exo.countDocuments({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);
        // console.log('limit:'+req.query.limit+  '\nitemCount:'+itemCount+ '\npageCount:'+pageCount);
        res.render('./exo/index.ejs', {
            urls: results,
            pageCount,
            itemCount,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
        })
    } catch (err) {
        next(err);
    }
}


controller.save = (req, res) => {
    try {
        var url = req.body.url_input.replace(/^(https?):\/\//gm, '');

        let newUrl = Exo({
            url:  validator.escape(url),
        })
        newUrl.nom = validator.escape('item-' + newUrl._id).trim()
        newUrl.save(function(err) {
        if (err) throw err;
        res.redirect("/"); 
        });
    } catch (error) {
        
    }
    
}

controller.item = (req, res) => {
    try {
        Exo.findOne({nom:req.params.id},(err,url)=>{
            res.redirect('https://' + url.url);
        });
    } catch (error) {
        
    }
    
}

controller.qrcode = (req,res) => {
    try {
        Exo.findOne({nom:req.params.item},(err,url)=>{
            QRCode.toDataURL(`https://qr-code-generator-2020.herokuapp.com/item/${url.nom}`, function (err, url) {
                res.json(url);
              })
        }).lean();
    } catch (error) {   
    }
}

module.exports = controller;