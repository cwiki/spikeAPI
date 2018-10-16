# spike API
The spike api is designed to be a very light, fast and above all else simple api.
Easy for individuals of any skill level to use.

```
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
│       ├── genericRoutes.js - generic REST endpoints with simple permission schema 
│       └── *.js - API/Controller endpoints
|
├── public/ - static file folder
├── uploads/ - upload folder
└── logs/ - contain log files
```

# Building your APP
## __app/__
Your application lives in the __app/__ directory in this directory. Starting in the index.js. From here you create 

# Troubleshooting
### forbidden
ensure that the requesting url is listed in the config hosts