const twitter = require('twitter-lite');
const cron = require('node-cron');

const client = new twitter({
    subdomain: "api", 
    version: "1.1", 
    consumer_key: "4AcofLLcifmThpUS5FKtAdb2c",
    consumer_secret: "5tbHLTM00c5CNrk4PRbh3xqwlcjLddM64oeX1BjMX7gpSexhFa",
    access_token_key: "502195313-WUhpbY38sq5kqQZD6v0aZXZ1S2A7WEM53cg6Eff2",
    access_token_secret: "PR06HAyvJ9GzASpaKiXG78U3lbKQvKEBogeitUC4chz8q"
  });

const express = require('express');
app = express();
const https = require('https');
    let districts = [{district_id: 276, district_name: "Bangalore Rural"},{district_id: 265, district_name: "Bangalore Urban"}, {district_id: 294, district_name: "BBMP"}];
    cron.schedule('* * * * * *', function() {
    const date = new Date();
    let datestr = date.getDate() + '-0' + parseInt(date.getMonth() + 1) + '-' + date.getFullYear();    
    districts.map((i, k) => {
            let districtName = i.district_name;
            https.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=${i.district_id}&date=${datestr}`, (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    try {

                        let centers = JSON.parse(data).centers;
                        centers.map((i1, k1) => {
                            let centerName = i1.name;
                            let pincode = i1.pincode;
                            i1.sessions.map((i2, k2) => {
                            let message = `Total ${i2.available_capacity} (Dose 1 - ${i2.available_capacity_dose1} , Dose 2 - ${i2.available_capacity_dose2}) ${i2.vaccine} shots available for ${i2.min_age_limit}+ at ${centerName}, ${districtName}, ${pincode}`;
                               if (i2.available_capacity > 0  && i2.min_age_limit !== 45) {
                                     client.post('statuses/update', { status: message }).then(result => {
                                         console.log('You successfully tweeted this : "' + result.text + '"');
                                       }).catch(console.error);
}

                            });

                        });
                    } catch (e) {}

                });
            }).on('error', (err) => {
                console.log("Error: " + err.message);
            });
        });
    });
app.listen(3000);