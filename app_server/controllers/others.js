var others = {
  about:function(req, res) {
    res.render('about', {title: 'About'});
  }
};

module.exports = others;

// module.exports.about = others.about;