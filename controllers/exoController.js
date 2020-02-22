const controller = {};
let Exo = require('../models/exo');
const validator = require('validator');
const paginate = require('express-paginate');
const QRCode = require('qrcode');
const fetch = require('isomorphic-fetch');


controller.index = async (req, res, next) => {
    try {
        const [results, itemCount] = await Promise.all([
            Exo.find({}).sort({ _id: -1 }).limit(req.query.limit).skip(req.skip).lean().exec(),
            Exo.countDocuments({})
        ]);
        // console.log(results)

        const pageCount = Math.ceil(itemCount / req.query.limit);
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

    if (req.body.url_input == ""){
      return res.redirect("/");
    } 
      
    const secret_key = process.env.SECRET_KEY;
    const token = req.body.token;
    const verifUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;
    let url = req.body.url_input.replace(/^(https?):\/\//gm, '');
    url = validator.escape(url);

    const urlExist = require("url-exist");

    (async () => {
        const exists = await urlExist("https://"+url);
        // console.log(exists);
        if (exists === true){
          if (!process.env.SECRET_KEY) {
            Exo.nextCount(function(err, count) {
                if (err) throw err;
                let newUrl = Exo({url});
                newUrl.nextCount(function(err, count) {
                    // console.log(url);
                    if (err) throw err;
                    newUrl.nom = validator.escape('item-' + count).trim();
                    newUrl.save(function (err) {
                        if (err) throw err;
                        req.flash("success", "L'url à bien été enregistrée");
                        res.redirect("/");
                    });
                });
            });
          }
  
          const response = await fetch(verifUrl, {
            method: 'post'
          })
            .then(response => response.json())
            .then(google_response => {
                if (google_response.success == true) {
                    Exo.nextCount(function(err, count) {
                        if (err) throw err;
                        let newUrl = Exo({url});
                        newUrl.nextCount(function(err, count) {
                            if (err) throw err
                            newUrl.nom = validator.escape('item-' + count).trim();
                            newUrl.save(function (err) {
                                if (err) throw err;
                                req.flash("success", "L'url à bien été enregistrée");
                                res.redirect("/");
                            });
                        });
                    });
                }
            })
            .catch(error => res.json({ error }));

        }
        if(exists === false){
          req.flash("error", "L'url n'existe pas");
          res.redirect('/');
        }

    })();

}

controller.item = (req, res) => {
    // try {
        Exo.findOne({ nom: req.params.id }, (err, url) => {
            if (url === null) {
              req.flash("error", "Un problème est survenu, veuillez réessayer");
              res.redirect('/');
            }
            if (url !== null) {
              res.redirect('https://' + url.url);
            }
        }).lean();
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