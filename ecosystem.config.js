/**
 * @description pm2 configuration file.
 * @example
 *  production mode :: pm2 start ecosystem.config.js --only prod
 *  development mode :: pm2 start ecosystem.config.js --only dev
 */

module.exports = {
  apps: [
    {
      name: 'trading-api',
      script: './dist/server.js',
      exec_mode: 'fork',
      instance_var: 'INSTANCE_ID',
      instances: 1,
      node_args: '-r ts-node/register -r tsconfig-paths/register',
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',
      merge_logs: true,
      output: './logs/access.log',
      error: './logs/error.log',
      env: {
        TS_NODE_BASEURL: './dist',
        PORT: 8000,
        NODE_ENV: 'production',
        REDIS_PORT:11086,
        REDIS_USERNAME:'default',
        REDIS_PASSWORD:'3xcmAvXSvECCPVKEu6GHEs6J9BbGI07X', 
        REDIS_HOST:'redis-11086.c264.ap-south-1-1.ec2.cloud.redislabs.com'
      },
    },
    {
      name: 'trading-api-dev',
      script: './dist/server.js',
      exec_mode: 'fork',
      instance_var: 'INSTANCE_ID',
      instances: 1,
      node_args: '-r ts-node/register -r tsconfig-paths/register',
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',
      merge_logs: true,
      output: './logs/access.log',
      error: './logs/error.log',
      env: {
        TS_NODE_BASEURL: './dist',
        PORT: 8000,
        NODE_ENV: 'development',
        REDIS_PORT:11086,
        REDIS_USERNAME:'default',
        REDIS_PASSWORD:'3xcmAvXSvECCPVKEu6GHEs6J9BbGI07X', 
        REDIS_HOST:'redis-11086.c264.ap-south-1-1.ec2.cloud.redislabs.com'
      },
    },
  ],
};

// const deploy = {
//   production: {
//     user: 'user',
//     host: '0.0.0.0',
//     ref: 'origin/master',
//     repo: 'git@github.com:repo.git',
//     path: 'dist/server.js',
//     'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --only prod',
//   },
// };
