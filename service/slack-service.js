import { RtmClient } from '@slack/client';
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const config = require('../conf/config')
const Promise = require("bluebird");
export class SlackService {
    sendUserFeedBack(message) {
        let bot_token = process.env.SLACK_BOT_TOKEN || config.slack.bottoken;
        let feedbackChannel = config.slack.feedback_channel;
        let rtm = new RtmClient(bot_token);
        let channel;

        return new Promise(function (resolve, reject) {
            rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
                rtm.sendMessage(message, 'G4GFP8BPU');
                resolve({ status: 'ok' })
            });

            rtm.start();
            rtm.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, function () {
                reject({ status: 'error' })
            });
        });
    }
}