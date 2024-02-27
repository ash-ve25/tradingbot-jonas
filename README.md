## Project Directory Structure

```
├── src
│   ├── server.ts
│   ├── app.ts
│   ├── config
│   │   ├── index.ts
│   ├── dtos
│   │   ├── schema.dtos.ts
│   ├── interface   //common Interface
│   │   ├── routes.interface.ts
│   ├── jobs        //Cron Jobs
│   │   ├── token.cron.ts
|   ├──tests
│   │   ├── auth
│   │   │   ├── mock.ts
│   │   │   └── auth.test.ts
│   ├── modules
│   │   ├── access
│   │   │   ├── access.controller.ts
│   │   │   ├── access.route.ts
│   │   │   └── access.service.ts
│   ├── logs
│   │   └── debug
│   │   ├── error
│   ├── utils        //All Required Singleton Function/package
│   │   ├── common.ts
├── .env
├── .gitignore
├── .eslintrc
├── .swcrc  //Compile TS to JS
├── .eslintignore
├── .prettierrc
├── .prettierignore
├──  nodemon.json  //post script for using nodemon
├──  ecosystem.config.js  //deploying using pm2
├── .nvmrc
├── .vscode
│   └── launch.json
├── package-lock.json
├── package.json
├── swagger.yaml
├── jest.config.js
└── tsconfig.json
```

## POSTMAN COLLECTION
