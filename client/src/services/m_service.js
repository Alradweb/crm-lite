import React from 'react';
import M from 'materialize-css/dist/js/materialize';
export const m = {...M, showMessage};

export const MContext = React.createContext(m);

function showMessage(message){
    M.toast({html: message, displayLength: 5000});
}