const config = require('../conf/config');
const Promise = require('bluebird');
const rp = require('request-promise');

export class SlackService {
  getBaseUrl() {
    var host = config.slackserver.host;
    var port = config.slackserver.port;

    return host + ':' + port;
  }
  //post and get from a poc
  postFeedbackToPoc(message) {
    var url = this.getBaseUrl() + '/posttopoc';
    var options = {
      method: 'POST',
      uri: url,
      body: {
        name: message.name,
        location: message.location,
        phone: message.phone,
        department: message.department,
        message: message.message
      },
      json: true
    };

    return new Promise(function (resolve, reject) {
      rp(options)
        .then(function (parsedBody) {
          resolve({ status: 'okay' });
        })
        .catch(function (err) {
          console.log('Error:', err);
          resolve({ status: err });
        });
    });
  }
  getPocMessages(count, oldest) {
    var geturl = this.getBaseUrl() + '/pocfeedback/' + count + '/' + oldest;

    return new Promise(function (resolve, reject) {
      rp(geturl)
        .then(function (data) {
          resolve(data);
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    });
  }
  postToChannels(message, channel) {
    var url = this.getBaseUrl() + '/posttochannel';
    var options = {
      method: 'POST',
      uri: url,
      body: {
        name: message.name,
        location: message.location,
        phone: message.phone,
        department: message.department,
        message: message.message,
        channel: channel
      },
      json: true
    };

    return new Promise(function (resolve, reject) {
      rp(options)
        .then(function (parsedBody) {
          resolve({ status: 'okay' });
        })
        .catch(function (err) {
          console.log('Error:', err);
          resolve({ status: err });
        });
    });
  }
  postToGroups(message, group) {
    var url = this.getBaseUrl() + '/posttogroup';
    var options = {
      method: 'POST',
      uri: url,
      body: {
        name: message.name,
        location: message.location,
        phone: message.phone,
        department: message.department,
        message: message.message,
        group: group
      },
      json: true
    };

    return new Promise(function (resolve, reject) {
      rp(options)
        .then(function (parsedBody) {
          resolve({ status: 'okay' });
        })
        .catch(function (err) {
          console.log('Error:', err);
          resolve({ status: err });
        });
    });
  }
  getChannelMessages(count, oldest) {
    var geturl =
      this.getBaseUrl() + '/channel-slackmessages/' + count + '/' + oldest;

    return new Promise(function (resolve, reject) {
      rp(geturl)
        .then(function (data) {
          resolve(data);
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    });
  }

  //get from particular group and channel
  getFromChannel(channelname, count, oldest) {
    var geturl =
      this.getBaseUrl() +
      '/channel-slackmessages/' +
      channelname +
      '/' +
      count +
      '/' +
      oldest;

    return new Promise(function (resolve, reject) {
      rp(geturl)
        .then(function (data) {
          resolve(data);
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    });
  }

  getFromGroup(groupname, count, oldest) {
    var geturl =
      this.getBaseUrl() +
      '/group-slackmessages/' +
      groupname +
      '/' +
      count +
      '/' +
      oldest;

    return new Promise(function (resolve, reject) {
      rp(geturl)
        .then(function (data) {
          resolve(data);
        })
        .catch(function (err) {
          console.log(err);
          reject(err);
        });
    });
  }
}
