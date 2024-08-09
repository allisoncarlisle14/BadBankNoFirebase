import React, { createContext, useState } from 'react';

// the context object comes with a provider that takes a value, which is passed to the components that are consuming that context
const UserContext = createContext(null);

const UserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({
        name: '',
        email: '',
        password: '',
        balance: 0
    })


return (
    <UserContext.Provider value = {{currentUser, setCurrentUser}}>
        {children}
    </UserContext.Provider>
);

}

export {UserContext, UserProvider}


