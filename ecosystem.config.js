module.exports = {
  apps: [{
    name: 'investogold',
    script: 'server.js',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    
    // Environment configurations
    env: {
      NODE_ENV: 'development',
      PORT: 5000,
      COMMON_VARIABLE: 'true'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      NODE_OPTIONS: '--max-old-space-size=2048', // Increase memory limit
      UV_THREADPOOL_SIZE: 128 // Increase thread pool for better I/O performance
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 5001
    },
    
    // Logging configuration
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    log_type: 'json', // Structured logging
    
    // Process management
    autorestart: true,
    max_restarts: 15, // Increased restart limit
    min_uptime: '30s', // Longer minimum uptime
    max_memory_restart: '1.5G', // Increased memory limit
    restart_delay: 4000, // 4 second delay between restarts
    
    // Performance optimization
    watch: false, // Disable in production for performance
    ignore_watch: [
      'node_modules',
      'logs',
      '.git',
      '.next',
      'uploads',
      '*.log'
    ],
    
    // Advanced configurations
    kill_timeout: 5000, // Time to wait before force killing
    listen_timeout: 8000, // Time to wait for app to listen
    wait_ready: true, // Wait for ready signal
    
    // Health monitoring
    health_check_grace_period: 30000, // 30 seconds grace period
    
    // Process behavior
    force: true, // Force restart if app doesn't stop gracefully
    treekill: true, // Kill all child processes
    
    // Environment variables for optimization
    node_args: [
      '--max-old-space-size=2048',
      '--optimize-for-size'
    ],
    
    // Custom startup script for database checks
    pre_start: './scripts/pre-start-check.sh',
    
    // Source map support in production
    source_map_support: true,
    
    // Instance variables (useful for load balancing)
    instance_var: 'INSTANCE_ID',
    
    // Cron restart for memory cleanup (every day at 3 AM)
    cron_restart: '0 3 * * *',
    
    // Interpreter options
    interpreter_args: '--harmony',
    
    // Namespace for grouping apps
    namespace: 'investogold-production'
  }],
  
  // Global PM2 settings
  deploy: {
    production: {
      user: 'root',
      host: '72.61.144.187',
      ref: 'origin/main',
      repo: 'https://github.com/Pydart-Intelli-Corp/btcbot_node.git',
      path: '/var/www/investogold',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};