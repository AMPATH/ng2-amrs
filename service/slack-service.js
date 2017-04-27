const WebClient = require('@slack/client').WebClient;
const config = require('../conf/config')
const Promise = require("bluebird");
export class SlackService {
    sendUserFeedBack(message) {
        let bot_token = process.env.SLACK_BOT_TOKEN || config.slack.bottoken;
        let feedbackChannel = config.slack.feedback_channel;
        return new Promise(function (resolve, reject) {
            let web = new WebClient(bot_token);
            web.chat.postMessage('G4GFP8BPU', 'Hello there', function (err, res) {
                if (err) {
                    console.log('Error:', err);
                    resolve({ status: err });
                } else {
                    console.log('Message sent: ', res);
                    resolve({ status: 'okay' });
                }
            });
        });
    }
}