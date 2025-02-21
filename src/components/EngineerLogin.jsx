import React, { useState } from 'react';

function EngineerLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleEngineerLogin = async () => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            // Optionally, store the role in localStorage or state
        } else {
            console.log(data.error);  // Handle error
        }
    };

    return (
        <div>
            <h2>Engineer Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleEngineerLogin}>Login</button>
        </div>
    );
}

export default EngineerLogin;
