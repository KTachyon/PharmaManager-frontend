import Promise from 'bluebird';
import request from 'browser-request';

export default (requestData) => {
    requestData.withCredentials = true;

    return new Promise(function(fulfill, reject) {
        request(requestData, function(error, response, body) {
            if (error) {
                let err = new Error(response.body);
                err.response = response;
                err.body = response.body;

                return reject(err);
            }

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
