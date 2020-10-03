import * as React from 'react';
import { Providers } from './src/providers';

import 'firebase/auth';
import 'firebase/firestore';

export const wrapPageElement = ({ element, props }) => <Providers {...props}>{element}</Providers>;
