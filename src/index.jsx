import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import App from './components/App';

import { AppView } from './components/AppView';
import { PatientsView } from './components/patient/PatientsView';
import { PatientView } from './components/patient/PatientView';
import { DrugsView } from './components/drug/DrugsView';
import { DrugView } from './components/drug/DrugView';
import { StockReportView } from './components/stock/StockReportView';

import ReduxToastr, { reducer as toastrReducer } from 'react-redux-toastr';

const reducers = {
  // ... other reducers ...
  toastr: toastrReducer // <- Mounted at toastr.
};

const appReducer = combineReducers(reducers);
const store = createStore(appReducer);

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
    <Route path="report">
        <IndexRoute component={StockReportView} />
    </Route>
</Route>;

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Router history={hashHistory}>{routes}</Router>
            <ReduxToastr/>
        </div>
    </Provider>,
    document.getElementById('app')
);
