import React from 'react';
import './App.css';
import Login from './components/login/Login';
import useToken from './components/Utils/useToken';
import TableContainer from './components/Table/TableContainer';

function App() {
    const  logout = () => {
      sessionStorage.clear();
      window.location.href = '/';
  }
    const { token, setToken } = useToken();
    if(!token) {
      return <Login setToken={setToken} />
    }  

    return (
        <div>
        <button className='btn btn-primary btn-logout' onClick={logout}>Logout</button>
        <TableContainer/>
        </div>

   );
}
export default App;
