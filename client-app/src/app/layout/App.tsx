import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import NavBar from '../../features/nav/NavBar'
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/form/ActivityForm';
import ActivityDetails from '../../features/details/ActivityDetails';



const App:React.FC<RouteComponentProps> = ({location}) => {
 
  return (
    <Fragment>
        <Route exact path="/" component={HomePage} />
        <Route path={"/(.+)"} render={() => (
      <Fragment>
      <NavBar />
      <Container style={{marginTop: "7em"}}>
        <Route exact path="/activities" component={ActivityDashBoard} />
        <Route path="/activities/:id" component={ActivityDetails} />
        <Route key={location.key} path={["/createActivity", "/manage/:id"]} component={ActivityForm} />
      </Container>
      </Fragment>
        )}/>
    </Fragment>
  );
}

export default withRouter(observer(App));
