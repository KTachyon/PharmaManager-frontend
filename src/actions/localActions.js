export function setState(state) {
    return {
        type : 'SET_STATE',
        state
    };
}

export function upsertDrug(drug) {
    return {
        type : 'UPSERT_DRUG',
        drug
    };
}

export function removeDrug(drug) {
    return {
        type : 'REMOVE_DRUG',
        drug
    };
}

export function upsertPatient(patient) {
    return {
        type : 'UPSERT_PATIENT',
        patient
    };
}

export function removePatient(patient) {
    return {
        type : 'REMOVE_PATIENT',
        patient
    };
}
