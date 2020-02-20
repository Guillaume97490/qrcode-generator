const controller = {};
let Exo = require('../models/exo');
const validator = require('validator');
const paginate = require('express-paginate');
var QRCode = require('qrcode')





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
    var url = req.body.url_input.replace(/^(https?):\/\//gm, '');

    let newUrl = Exo({
        url:  validator.escape(url),
    })
    newUrl.nom = validator.escape('item-' + newUrl._id).trim()
    newUrl.save(function(err) {
        if (err) throw err;
        res.redirect("/exo"); 
    });
}

controller.item = (req, res) => {
    Exo.findOne({nom:req.params.item},(err,url)=>{
        res.redirect('https://' + url.url);
    });
}

controller.qrcode = (req,res) => {
    Exo.findOne({nom:req.params.item},(err,url)=>{
        QRCode.toDataURL(url.url, function (err, url) {
            res.send(url);
          })
        // res.redirect('https://' + url.url)
    });
}

module.exports = controller;