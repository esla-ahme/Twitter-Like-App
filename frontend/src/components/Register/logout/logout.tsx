import { useApolloClient } from '@apollo/client';
import closestIndexTo from 'date-fns/esm/closestIndexTo/index';
import React from 'react';
import { Link } from "react-router-dom"
import { authenticatedVal } from '../../../common/cache';
import { LoggedUser } from '../../../common/queries/Userqery';
import { clientLog } from '../login_form/login';




function logoutSubmit() {
    localStorage.removeItem('token');
    clientLog.clearStore()
    clientLog.cache.gc()
    authenticatedVal(false);
}

export function Logout() {
    return (
        <div>
            <Link to="/login" className=" mt-1 w-52 text-center block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 hover:text-gray-900 
         hover:rounded-full rounded-full"  onClick={() => logoutSubmit()} >logout </Link>

        </div>
    )
}
