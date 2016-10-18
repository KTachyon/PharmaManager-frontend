import Promise from 'bluebird';
import request from 'browser-request';

export default (requestData) => {
    return new Promise(function(fulfill, reject) {
        request(requestData, function(error, response, body) {
            console.log('error', error, 'response', response);

            if (error) {
                let err = new Error(response.body);
                err.response = response;
                err.body = response.body;

                return reject(err);
            }

            console.log('hello');

            if (response.statusCode >= 400) {
                let err = new Error();
                err.response = response;
                err.body = body;

                return reject(err);
            }

            fulfill(body);
        });
    });
};
