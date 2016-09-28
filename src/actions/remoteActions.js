import _ from 'lodash';

function baseAction(type, data) {
    return _.assign({ type, remote : true }, data);
}

export function createPatient(patient) {
    return baseAction('CREATE_PATIENT', { patient });
}

export function updatePatient(patient) {
    return baseAction('UPDATE_PATIENT', { patient });
}

export function deletePatient(patient) {
    return baseAction('DELETE_PATIENT', { patient });
}

export function searchPatient(text) {
    return baseAction('SEARCH_PATIENT', { text });
}

export function createDrug(drug) {
    return baseAction('CREATE_DRUG', { drug });
}

export function updateDrug(drug) {
    return baseAction('UPDATE_DRUG', { drug });
}

export function deleteDrug(drug) {
    return baseAction('DELETE_DRUG', { drug });
}

export function searchDrug(text) {
    return baseAction('SEARCH_DRUG', { text });
}
