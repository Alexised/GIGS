import {Navigate, Route, Routes} from "react-router-dom";
import Main from "../components/Main.jsx";
import {useState} from "react";
import Dashboard from "../components/Dashboard.jsx";
import ListForms from "../components/form/ListForms.jsx";
import ListLogs from "../components/form/ListLogs.jsx";
import ListLogsEvents from "../components/form/ListLogsEvents.jsx";
import CreateLogs from "../components/form/CreateLogs.jsx";
import ListSignatures from "../components/signature/ListSignatures.jsx";
import ListUsers from "../components/user/ListUsers.jsx";
import CreateUser from "../components/user/createUser/CreateUser.jsx";
import CreateLocation from "../components/location/createLocation/CreateLocation.jsx";
import ListLocation  from "../components/location/ListLocation.jsx";
import CreateEvents from "../components/form/createEvents/CreateEvents.jsx";
import FillForm from "../components/form/fillForm/LogsForm.jsx";
import ValidateForm from "../components/form/ValidateForm.jsx";
import CreateSignature from "../components/signature/createSignature/CreateSignature.jsx";
import Swal from "sweetalert2";
import Login from "../pages/login/Login.jsx";
import ForgotPassword from '../pages/login/ForgotPassword.jsx';
import RecoveryPassword from '../pages/login/RecoveryPassword.jsx';

function Router(props) {
    return (
        <div>
            <Routes>
                <Route path='/' element={props.isLoggedIn===false ?  <Navigate to='/login'/>: <Main component={<Dashboard></Dashboard>}></Main>}/>
                <Route path='/:id' element={props.isLoggedIn===false ?  <Navigate to='/login'/>: <Main component={<Dashboard></Dashboard>}></Main>}/>
                <Route path='/forms' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<ListForms></ListForms>}></Main>}/>
                <Route path='/logs' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<ListLogs></ListLogs>}></Main>}/>
                <Route path='/show/logs/:id' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<ListLogsEvents></ListLogsEvents>}></Main>}/>
                <Route path='/logs/create' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<CreateLogs></CreateLogs>}></Main>}/>
                <Route path='/logs/edit/:id' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<CreateLogs></CreateLogs>}></Main>}/>
                <Route path='/users' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<ListUsers></ListUsers>}></Main>}/>
                <Route path='/user/create' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<CreateUser></CreateUser>}></Main>}/>
                <Route path='/signature' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<ListSignatures></ListSignatures>}></Main>}/>
                <Route path='/location' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<ListLocation></ListLocation>}></Main>}/>
                <Route path='/location/create' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<CreateLocation></CreateLocation>}></Main>}/>
                <Route path='/location/edit/:id' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<CreateLocation></CreateLocation>}></Main>}/>
                <Route path='/signature' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<ListSignatures></ListSignatures>}></Main>}/>
                <Route path='/signature/create' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<CreateSignature></CreateSignature>}></Main>}/>
                <Route path='/show/form/:eventId' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<FillForm show={true}></FillForm>}></Main>}/>
                <Route path='location/:locationId/form/:id' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<FillForm show={false}></FillForm>}></Main>}/>
                <Route path='/form/create' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<CreateEvents></CreateEvents>}></Main>}/>
                <Route path='/form/edit/:id' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Main component={<CreateEvents></CreateEvents>}></Main>}/>
                <Route path='/login' element={props.isLoggedIn===false ? <Login></Login>: <Navigate to='/'/>}/>
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/change-password' element={<RecoveryPassword />} />
                <Route path='/validate' element={<ValidateForm />} />
                <Route path='*' element={props.isLoggedIn===false ? <Navigate to='/login'/>: <Navigate to='/'/>}/>
            </Routes>
        </div>
    );
}

export default Router;
