// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import axios from 'axios';
import { REDIRECT_URI, CLIENT_ID } from './config.js';

/**
 * /login - directs user to Google sign-in page
 * For more information, see https://developers.google.com/identity/protocols/oauth2/web-server
 */ 
export const login = async () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = new URLSearchParams({
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    });
    
    window.location.href = `${rootUrl}?${options.toString()}`;
};

/**
 * /logout - stub logout
 */ 
export const logout = async () => {
    try {
        await fetch(`/logout`);
    } catch(e) {
        throw new Error(e);
    }
};

export default { login, logout };
