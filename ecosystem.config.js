module.exports = {
  apps: [
    {
      name: 'expressjs-highload-user-balance',
      script: './src/index.js',
      instances: 5,
      // autorestart: true, // DEFAULT: true
      // exec_mode: 'fork', // DEFAULT: fork
      watch: false,
      max_memory_restart: '1G', // 2GB, 512M
      env: {  // default environment
        NODE_ENV: 'production'
      },
      env_development: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      cwd: '/Users/user/Development/_projects/expressjs-highload-user-balance',
      // node_args: '--require dotenv/config'
      node_args: '/Users/user/Development/_projects/expressjs-highload-user-balance',
    }
  ]
};
