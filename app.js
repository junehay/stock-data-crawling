const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const target = require('./target.json');

const app = express();
let port = 3000;

app.get('/', (req, res, next) => {
    res.send('index');
});

app.get('/static', (req, res, next) => {
    const getHtml = async () => {
        try {
            return await axios.get(target.targetUrl, {
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            });
        } catch (error) {
            console.error(error);
        }
    };

    getHtml()
        .then(html => {
            let decodeHtml = iconv.decode(html.data, 'EUC-KR');
            let list = [];
            const $ = cheerio.load(decodeHtml);
            const $bodyList = $('table tbody tr');
            // console.log($bodyList.find('gray03'))
            $bodyList.each(function (i, elem) {
                if($(this).find('.gray03').text()){
                    list[i] = {
                        date: $(this).find('.gray03').text(),
                        endPrice: $(this).find('.p11').first().text(),
                        startPrice: $(this).find('.p11').eq(2).text(),
                        highPrice: $(this).find('.p11').eq(3).text(),
                        lowPrice: $(this).find('.p11').eq(4).text(),
                        volume: $(this).find('.p11').last().text()
                    };
                }
            });
            let filterList = list.filter((val, index, arr) => {
                if(val){
                    return val;
                }
            });
            return filterList;
        })
        .then(res => console.log('res : ', res));

    res.send('static')
});


app.listen(port, () => {
    console.log(`server start. port is ${port}`);
})