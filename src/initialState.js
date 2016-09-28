import {fromJS} from 'immutable';

let initialState = {
    patients : [
        { name : 'Maria Albertina', id : 1 },
        { name : 'Vanessa Albertina', id : 2 },
        { name : 'Tomás Taveira', id : 3 },
        { name : 'Carlos Cruz', id : 4 }
    ],
    drugs : [
        { name : 'Xanax', id : 1 },
        { name : 'Brufen 400', id : 2 },
        { name : 'Paracetamol', id : 3 },
        { name : 'Ben-u-ron', id : 4 }
    ]
};

export default initialState;
