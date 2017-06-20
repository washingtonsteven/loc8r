api_util = {
  sendJSONResponse:function(res, status, content) {
    if (!status) status = 200;
    if (!content) content = {"status" :"success"};

    res.status(status);
    res.json(content);
  }
}

module.exports = api_util;