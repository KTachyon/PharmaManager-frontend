import {Map} from 'immutable';

function noop() { return; }

export function addPatient(state, patient) {
    noop(patient);
}

export function updatePatient(state, patient) {
    noop(patient);
}

export function deletePatient(state, patient) {
    noop(patient);
}

export function setState(state, newState) {
    return state.merge(newState);
}

export default function(state = Map(), action) {
    switch(action.type) {
        case 'SET_STATE':
                return setState(state, action.state);
        case 'CREATE_PATIENT':
            return addPatient(state, action.patient);
        case 'UPDATE_PATIENT':
            return updatePatient(state, action.patient);
        case 'DELETE_PATIENT':
            return deletePatient(state, action.patient);
    }

    return state;
}
