'use strict';

// Load NPM modules
import React from 'react';
import { render } from 'react-dom';

// Import application
import App from './App';

// Render application but only hydrate the DOM
render(<App />, document.getElementById('main'));
