const brainly = require('brainly-scraper-v2');
 


module.exports = {
    getAnswer:(question, lang='id') => {
        brainly(question, 10, lang).then(res => {
            return res.data;
        });
    }
}