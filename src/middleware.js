import request from 'browser-request';
import * as RequestBuilder from './RequestBuilder';
import localActions from './localActions';

function noop() { return; }

export function getRequestBuilder(context, action) {
    switch (context) {
        case 'PATIENT':
            return RequestBuilder.PatientRequests();
        case 'DRUG':
            return RequestBuilder.DrugRequests();
        case 'MEDICATION':
            return RequestBuilder.MedicationRequests(action.patient.get('id'));
        case 'PRESCRIPTION':
            return RequestBuilder.PrescriptionRequests(action.patient.get('id'));
    }

    return null;
}

export function getSubject(context, operation, action) {
    if (operation === 'SEARCH') {
        return action.text;
    }

    switch (context) {
        case 'PATIENT':
            return action.patient;
        case 'DRUG':
            return action.drug;
        case 'MEDICATION':
            return action.medication;
        case 'PRESCRIPTION':
            return action.prescription;
    }

    return null;
}

export function operate(requestBuilder, operation, subject) {
    switch (operation) {
        case 'CREATE':
            return requestBuilder.create(subject);
        case 'UPDATE':
            return requestBuilder.update(subject.get('id'), subject);
        case 'DELETE':
            return requestBuilder.delete(subject.get('id'));
        case 'SEARCH':
            return requestBuilder.search(subject); // TODO: ...
    }

    return null;
}

export function remoteActionRequest(action) {
    let [operation, context] = action.split('_');

    return operate( getRequestBuilder(context), operation, action.subject );
}

/*

Idea:

action -> dispatch -> middleware:
    if remote -> request, don't "next" action -> onResponse -> create new action -> dispatch
    if !remote -> next(action)


> remote middleware
> error middleware

*/

export default store => next => action => {
    noop(store);

    if (action.remote) {
        let requestObject = remoteActionRequest(action);

        request(requestObject, function(error, response, body) {
            if (error) {
                // TODO: handle error, respect body
                return;
            }

            if (response.statusCode >= 400) {
                // TODO: handle error, respect body
                return;
            }

            //next(action); // TODO: respect body (server might have change logic)
            store.dispatch( localActions.setState({ patients : JSON.parse(body) }) );
        });

        // TODO: Should dispatch an action that tells the UI to show that something's loading

        return;
    }

    next(action);
};
