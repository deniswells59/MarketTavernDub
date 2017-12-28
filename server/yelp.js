import express from 'express';
import request from 'request';

const router = express.Router();

router.get('/reviews/:yelpID', (req, res) => {
  const yelpID = req.params.yelpID;

  request.post('https://api.yelp.com/oauth2/token', {
      form: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
      }
    }, (err, resp, body) => {
      if(err) return res.status(400).send(err);

      let token = JSON.parse(body).access_token;
      request({
        url: `https://api.yelp.com/v3/businesses/${yelpID}`,
        headers: {
          'Authorization': `BEARER ${token}`
        }
      }, (err, resp, body) => {
        if(err) return res.status(400).send(err);
        let data = JSON.parse(body);
        // let review = { rating: 0 };
        //
        // data.forEach(rev => {
        //   if(rev.rating > review.rating) return review = rev;
        // });

        res.send(data);
      });
    });
});

module.exports = router;
