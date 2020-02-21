const controller = {};
let Exo = require('../models/exo');
const validator = require('validator');
const paginate = require('express-paginate');
const QRCode = require('qrcode');
const fetch = require('isomorphic-fetch');


controller.index = async (req, res, next) => {
    try {
        const [results, itemCount] = await Promise.all([
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


controller.save = async (req, res) => {
    // try {
    // console.log(req.body);
    const secret_key = process.env.SECRET_KEY;
    const token = req.body.token;
    const verifUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;


    if (!process.env.SECRET_KEY){
        if (req.body.url_input == "") return res.redirect("/");
            var url = req.body.url_input.replace(/^(https?):\/\//gm, '');

            let newUrl = Exo({
                url: validator.escape(url),
            });
            newUrl.nom = validator.escape('item-' + newUrl._id).trim();
            newUrl.save(function (err) {
                if (err) throw err;
                res.redirect("/");
            });
    }

    const response = await fetch(verifUrl, {
        method: 'post'
    })
        .then(response => response.json())
        .then(google_response => {
            if (google_response.success == true) {
                // todo; save et redirrect
                // res.json("true")

                if (req.body.url_input == "") return res.redirect("/");
                var url = req.body.url_input.replace(/^(https?):\/\//gm, '');

                let newUrl = Exo({
                    url: validator.escape(url),
                });
                newUrl.nom = validator.escape('item-' + newUrl._id).trim();
                newUrl.save(function (err) {
                    if (err) throw err;
                    res.redirect("/");
                });
            }
            // res.json({ google_response })
        })
        .catch(error => res.json({ error }));

    // console.log(response);

    // } catch (error) {

    // }

}

controller.item = (req, res) => {
    try {
        Exo.findOne({ nom: req.params.id }, (err, url) => {
            res.redirect('https://' + url.url);
        });
    } catch (error) {

    }

}

controller.qrcode = (req, res) => {
    try {
        Exo.findOne({ nom: req.params.item }, (err, url) => {
            QRCode.toDataURL(`https://qr-code-generator-2020.herokuapp.com/item/${url.nom}`, function (err, url) {
                res.json(url);
            })
        }).lean();
    } catch (error) {
    }
}

module.exports = controller;