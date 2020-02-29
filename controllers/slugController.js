const controller = {};
let Slug = require('../models/slug');
const validator = require('validator');
const paginate = require('express-paginate');
const QRCode = require('qrcode');
const fetch = require('isomorphic-fetch');
const siteUrl = process.env.URL||'localhost:3000/'
const ejs = require('ejs');
let modalTpl = require('../views/templates/modalTpl.js').data;
let lastUrlList = require('../views/templates/lastUrlList.js').data;


controller.index = async (req, res, next) => {
    
    try {
        const [results, itemCount] = await Promise.all([
            Slug.find({}).sort({ _id: -1 }).limit(req.query.limit).skip(req.skip).lean().select('_id').exec(),
            Slug.countDocuments({})
        ]);

        const pageCount = Math.ceil(itemCount / req.query.limit);
        if (req.xhr) {
            res.set('Content-Type', 'text/html');
            data={
                urls: results,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
                pageCount,
                itemCount,
                siteUrl
            }
            let compiled = ejs.compile(lastUrlList);
            let html = compiled({data});
            res.send(Buffer.from(html,'utf8')); // SEND MODAL IN HTML 

        }else{
            res.render('./slug/index.ejs', {
                urls: results,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
                pageCount,
                itemCount,
                siteUrl 
            })
        }
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
        const exists = await urlExist("https://"+validator.unescape(url));
        if (exists === true){
          if (!process.env.SECRET_KEY) { // CHECK IF GOOGLE RECAPTCHA SECRET_KEY
            Slug.nextCount(function(err, count) {
                if (err) throw err;
                let newUrl = Slug({url}); // CREATE NEW OBJECT OF URL
                newUrl.nextCount(function(err, count) {
                    if (err) throw err;
                    newUrl.save(function (err) { // SAVE THE OBJECT
                        if (err) throw err;
                        if (req.xhr) { // IF AJAX 
                            res.set('Content-Type', 'text/html');
                            data= {
                                type: "success",
                                message: "L'url à bien été enregistrée.",
                                newUrl: newUrl,
                                siteUrl: siteUrl
                            }
                            let compiled = ejs.compile(modalTpl);
                            let html = compiled({data});
                            res.send(Buffer.from(html,'utf8')); // SEND MODAL IN HTML 
                        }
                        if (!req.xhr){
                            res.redirect("/");
                        }
                    });
                });
            });
          }
  
          const response = await fetch(verifUrl, {
            method: 'post'
          })
            .then(response => response.json())
            .then(google_response => {
                if (google_response.success == true) { // IF GOOGLE RECAPTCHA IS OK
                    Slug.nextCount(function(err, count) {
                        if (err) throw err;
                        let newUrl = Slug({url});
                        newUrl.nextCount(function(err, count) {
                            if (err) throw err
                            newUrl.save(function (err) {
                                if (err) throw err;
                                if (req.xhr) {
                                    res.set('Content-Type', 'text/html');
                                    data= {
                                        type: "success",
                                        message: "L'url à bien été enregistrée.",
                                        newUrl: newUrl,
                                        siteUrl: siteUrl
                                    }
                                    let compiled = ejs.compile(modalTpl);
                                    let html = compiled({data});
                                    res.send(Buffer.from(html,'utf8'));
                                }
                                if (!req.xhr){
                                    res.redirect("/");
                                }
                            });
                        });
                    });
                }
            })
            .catch(error => res.json({ error }));

        }
        if(exists === false){
        if (req.xhr) {
            res.set('Content-Type', 'text/html');
            data= {
                type: "error",
                message: "L'url n'existe pas."
            }
            let compiled = ejs.compile(modalTpl);
            let html = compiled({data});
            res.send(Buffer.from(html,'utf8'));
        }else{
            res.redirect('/');
        }

        }
    })();

}

controller.redirect = (req, res) => {
    Slug.findOne({ _id: req.params.id }, (err, url) => {
        if (url === null) 
            res.redirect('/');
        
        if (url !== null) 
            res.redirect('https://' + validator.unescape(url.url));
        
    }).lean();
}

controller.qrcode = (req, res) => {
    Slug.findOne({ _id: req.params.item }, (err, url) => {
        QRCode.toDataURL(siteUrl+'url/' + url._id, function (err, slug) {
            res.json(slug);
        })
    }).lean();
}
module.exports = controller;