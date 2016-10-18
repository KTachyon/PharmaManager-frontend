const baseURL = 'http://localhost:3010/api/';

let baseCRUD = (identifier, hasSearch = false) => {
    let RequestBuilderObject = {
        getAll : () => {
            return {
                method : 'GET',
                url : baseURL + identifier,
                json : true
            };
        },

        get : (id) => {
            return {
                method : 'GET',
                url : baseURL + identifier + '/' + id,
                json : true
            };
        },

        create : (object) => {
            return {
                method : 'POST',
                url : baseURL + identifier,
                json : object
            };
        },

        upsert : (object) => {
            let id = object.get('id');

            if (id) { return RequestBuilderObject.update(id, object); }

            return RequestBuilderObject.create(object);
        },

        update : (id, object) => {
            return {
                method : 'PUT',
                url : baseURL + identifier + '/' + id,
                json : object
            };
        },

        delete : (id) => {
            return {
                method : 'DELETE',
                url : baseURL + identifier + '/' + id
            };
        }
    };

    if (hasSearch) {
        RequestBuilderObject.search = (terms) => {
            return {
                method : 'POST',
                url : baseURL + identifier + '/search',
                json : { searchTerms : terms }
            };
        };
    }

    return RequestBuilderObject;
};

var baseNestedCRUD = (identifier, parentIdentifier, parentID) => {
    return baseCRUD(parentIdentifier + '/' + parentID + '/' + identifier);
};

export let PatientRequests = () => {
    return baseCRUD('patients', true);
};

export let DrugRequests = () => {
    return baseCRUD('drugs', true);
};

export let PosologyRequests = (patientID) => {
    return baseNestedCRUD('posology', 'patients', patientID);
};

export let DrugBoxRequests = (patientID) => {
    return baseNestedCRUD('drugBox', 'patients', patientID);
};

export let DrugStockRequests = (patientID) => {
    let RequestBuilderObject = {
        getAll : () => {
            return {
                method : 'GET',
                url : baseURL + 'patients/' + patientID + '/drugStock',
                json : true
            };
        },

        getReport : () => {
            return {
                method : 'GET',
                url : baseURL + 'stock/report',
                json : true
            };
        }
    };

    return RequestBuilderObject;
};
