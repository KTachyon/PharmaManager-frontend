import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore /*, applyMiddleware*/ } from 'redux';
import reducer from './reducer';
import App from './components/App';
//import remoteMidleware from './middleware';
//import initialState from './initialState';

import { AppView } from './components/AppView';
import { PatientsView } from './components/patient/PatientsView';
import { PatientView } from './components/patient/PatientView';
import { DrugsView } from './components/drug/DrugsView';
import { DrugView } from './components/drug/DrugView';

//const createStoreWithMiddleware = applyMiddleware(remoteMidleware)(createStore);
//const store = createStoreWithMiddleware(reducer);

const store = createStore(reducer);
//store.dispatch( localActions.setState(initialState) );

const routes = <Route path="/" component={App}>
    <IndexRoute component={AppView} />
    <Route path="patients">
        <IndexRoute component={PatientsView} />
        <Route path=":patient_id" component={PatientView} />
    </Route>
    <Route path="drugs">
        <IndexRoute component={DrugsView} />
        <Route path=":drug_id" component={DrugView} />
    </Route>
</Route>;

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>{routes}</Router>
    </Provider>,
    document.getElementById('app')
);
