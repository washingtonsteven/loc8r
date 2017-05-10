var others = {
  about:function(req, res) {
    res.render('index', {title: 'About'});
  }
};

module.exports = others;

// module.exports.about = others.about;