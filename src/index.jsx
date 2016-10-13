import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore /*, applyMiddleware*/ } from 'redux';
import reducer from './reducer';
import App from './components/App';
//import remoteMidleware from './middleware';
import * as localActions from './actions/localActions';
import initialState from './initialState';

import { AppView } from './components/AppView';
import { PatientsViewContainer } from './components/patient/PatientsView';
import { PatientView } from './components/patient/PatientView';
import { DrugsViewContainer } from './components/drug/DrugsView';
import { DrugViewContainer } from './components/drug/DrugView';
import { PatientForm } from './components/patient/PatientForm';

import Test from './components/Test';

//const createStoreWithMiddleware = applyMiddleware(remoteMidleware)(createStore);
//const store = createStoreWithMiddleware(reducer);

const store = createStore(reducer);
store.dispatch( localActions.setState(initialState) );

const routes = <Route path="/" component={App}>
    <IndexRoute component={AppView} />
    <Route path="patients">
        <IndexRoute component={PatientsViewContainer} />
        <Route path=":patient_id" component={PatientView} />
    </Route>
    <Route path="drugs">
        <IndexRoute component={DrugsViewContainer} />
        <Route path=":drug_id" component={DrugViewContainer} />
    </Route>
    <Route path="pt">
        <IndexRoute component={PatientForm} />
    </Route>
    <Route path="test">
        <IndexRoute component={Test} />
    </Route>
</Route>;

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>{routes}</Router>
    </Provider>,
    document.getElementById('app')
);
