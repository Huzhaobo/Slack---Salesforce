var Botkit = require('botkit');
var jsforce = require('jsforce');
var conn = new jsforce.Connection({
    loginUrl: 'https://login.salesforce.com'
});
var username = 'rajamohanvakati@forescout1.com';
var password = 'Sujana@123JujWsyxDkNNa2FHUBfZ9rxR79';
conn.login(username, password, function (err, userInfo) {
    if (err) { return console.error(err); }
});
var controller = Botkit.slackbot();
var bot = controller.spawn({
    token: "xoxb-259949440100-hk6Iuf3Phed5zlfxGqwdWSTs"
})
bot.startRTM(function (err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});
controller.hears(['help', 'Salesforce '], 'interactive_message_callback,direct_message,direct_mention,mention', function (bot, message) {
    bot.startConversation(message, function (err, convo) {
        if (!err) {
            convo.say('Ok . Let me Help you ! ');
            convo.ask('Which Object data , say Contact or Opportunity or Account?', function (response, convo) {
                if (response.text == 'Contact') {
                    convo.say('Ok .You are looking for  ' + response.text + ' data ');
                    convo.ask('Can i have contact Name ?', function (response, convo) {
                        conn.query("SELECT Id,Title, Name,email ,Phone FROM Contact where name=\'"+response.text+"\' Limit 1", function (err, result) {
                            console.log(result);
                            var name = result.records[0].Name ; 
                            var email = result.records[0].EMail ; 
                            var phone= result.records[0].Phone; 
                            var id = result.records[0].Id ; 
                            console.log(name);
                            bot.reply(message, {
                                attachments: [
                                    {
                                        "fallback": "Required plain-text summary of the attachment.",
                                        "color": "#36a64f",
                                        "pretext": "Contact Details are here",
                                        "author_name": name,
                                        "title": "Contact Details",
                                        "title_link": "https://fscttt-dev-ed.my.salesforce.com/"+id,
                                        "text": "Details are here ",
                                        "fields": [
                                            {
                                                "title": "Name",
                                                "value": name,
                                                "short": false
                                            },
                                            {
                                                "title": "Phone",
                                                "value": phone,
                                                "short": false
                                            },
                                            {
                                                "title": "Id",
                                                "value": id,
                                                "short": false
                                            }
                                            

                                        ],
                                        "image_url": "http://my-website.com/path/to/image.jpg",
                                        "thumb_url": "http://example.com/path/to/thumb.png",
                                        "footer": "Slack API",
                                        "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
                                        "ts": 123456789
                                    }
                                ]
                            });


                            convo.say("Ok! Goodbye.");
                            convo.next();

                        });
                    });
                }
                if (response.text == 'Account') {
                    convo.say('Ok .You are looking for  ' + response.text + ' data ');
                    convo.ask('Can i have Account Name ?', function (response, convo) {
                    });
                }
                if (response.text == 'Opportunity') {
                    convo.say('Ok .You are looking for  ' + response.text + ' data ');
                    convo.ask('Can i have Opportunity  Name ?', function (response, convo) {
                    });
                }
                convo.next();
            }); // store the results in a field called nickname
            convo.on('end', function (convo) {
                if (convo.status == 'completed') {
                    bot.reply(message, 'OK! I Hope you find the infomration');
                } else {
                    bot.reply(message, 'OK, nevermind!');
                }
            });
        }
    });
});
controller.hears('^stop', 'direct_message', function (bot, message) {
    bot.reply(message, 'Goodbye');
    bot.rtm.close();
});
