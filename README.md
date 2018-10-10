# spike API
The rem 5 api is designed to be a very light, fast and above all else simple api.
Easy for individuals of any skill level to use.

Outline
├── app/
│   ├── index.js
│   ├── controllers/
│   │   └── *.js - controllers (hook directly to models)
│   ├── models/
│   │   ├── connections.js - database connections
│   │   └── *.js - database models (hook directly to storage)
│   ├── models/
│   │   ├── connections.js - database connections
│   │   └── *.js - database models (hook directly to storage)
│   ├── src/
│   │   ├── index.js - groups together local plugins
│   │   └── * - local plugins
│   └── views/
│       ├── index.js - router instance urls
│       └── *.js - views (hook directly to controllers)
├── logs/
│   ├── index.js - kept exclussively to keep logs folder in VC
│   └── *.log

├── config.js - local application config
├── LICENSE.md
├── package.json
├── README.md
└── server.js - application entry point


Troubleshooting
### forbidden
ensure that the requesting url is listed in the config hosts