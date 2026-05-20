
const register = require('./api/register');

const req = {
  method: 'POST',
  body: { username: 'testuser', password: 'testpassword' }
};

const res = {
  setHeader: () => {},
  status: function(code) {
    this.code = code;
    return this;
  },
  json: function(data) {
    console.log("Status:", this.code);
    console.log("Data:", data);
  },
  end: function(msg) {
    console.log("End:", msg);
  }
};

register(req, res).catch(console.error);
