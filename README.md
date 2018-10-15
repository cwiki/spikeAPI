# spike API
The rem 5 api is designed to be a very light, fast and above all else simple api.
Easy for individuals of any skill level to use.

Outline
├── app/
│   ├── asky.js - authorization\permission configuration
│   ├── index.js - entry point for API
|   |
│   ├── models/
│   │   ├── connections.js - Database loader for models
│   │   └── *.js - database definition files
|   |
│   └── views/
│       ├── genericRoutes.js - generic REST endpoints with simple permission schema hooks
│       └── *.js - API/Controller endpoints
|
├── public/ - static file folder
├── uploads/ - upload folder
└── logs/ - contain log files


Troubleshooting
### forbidden
ensure that the requesting url is listed in the config hosts