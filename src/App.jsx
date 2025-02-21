import React from 'react';
import './App.css';
import Search from './components/search.jsx';
import RandomAlbums from './components/RandomAlbums.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Favorites from './components/Favorites.jsx';
import EngineerLogin from './components/EngineerLogin.jsx';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Album Search</h1>
            </header>
            <Register />
            <Login />
            <EngineerLogin />
            <Favorites />
            <RandomAlbums />
            <Search />
        </div>
    );
}

export default App;
