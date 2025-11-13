#!/bin/bash

# investogold Server Monitoring and Maintenance Script
# Run this script periodically to monitor and maintain your VPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
APP_NAME="investogold"
APP_PATH="/var/www/investogold"
LOG_FILE="/var/log/investogold-monitor.log"
MAX_DISK_USAGE=80
MAX_MEMORY_USAGE=85
MAX_CPU_USAGE=90

# Functions
log() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_alert() {
    local message="$1"
    log "${RED}🚨 ALERT: $message${NC}"
    
    # Send email alert if configured
    if command -v mail >/dev/null 2>&1 && [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "[investogold] Server Alert" "$ALERT_EMAIL"
    fi
}

check_system_resources() {
    log "${BLUE}🔍 Checking system resources...${NC}"
    
    # Check disk usage
    DISK_USAGE=$(df / | awk 'NR==2{gsub(/%/,"",$5); print $5}')
    if [ "$DISK_USAGE" -gt "$MAX_DISK_USAGE" ]; then
        send_alert "High disk usage: ${DISK_USAGE}%"
    else
        log "${GREEN}✅ Disk usage: ${DISK_USAGE}%${NC}"
    fi
    
    # Check memory usage
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$MEMORY_USAGE" -gt "$MAX_MEMORY_USAGE" ]; then
        send_alert "High memory usage: ${MEMORY_USAGE}%"
    else
        log "${GREEN}✅ Memory usage: ${MEMORY_USAGE}%${NC}"
    fi
    
    # Check CPU usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    if (( $(echo "$CPU_USAGE > $MAX_CPU_USAGE" | bc -l) )); then
        send_alert "High CPU usage: ${CPU_USAGE}%"
    else
        log "${GREEN}✅ CPU usage: ${CPU_USAGE}%${NC}"
    fi
}

check_application_health() {
    log "${BLUE}🏥 Checking application health...${NC}"
    
    # Check if PM2 process is running
    if ! pm2 list | grep -q "$APP_NAME.*online"; then
        send_alert "Application is not running in PM2"
        log "${YELLOW}🔄 Attempting to restart application...${NC}"
        pm2 restart "$APP_NAME" || send_alert "Failed to restart application"
    else
        log "${GREEN}✅ PM2 process is running${NC}"
    fi
    
    # Check HTTP health endpoint
    if ! curl -f -s http://localhost:5000/health > /dev/null; then
        send_alert "HTTP health check failed"
    else
        log "${GREEN}✅ HTTP health check passed${NC}"
    fi
    
    # Check database connectivity
    cd "$APP_PATH"
    if ! node -e "
        const { sequelize } = require('./config/database');
        sequelize.authenticate()
          .then(() => process.exit(0))
          .catch(() => process.exit(1));
    " 2>/dev/null; then
        send_alert "Database connection failed"
    else
        log "${GREEN}✅ Database connection healthy${NC}"
    fi
}

check_services() {
    log "${BLUE}🔧 Checking system services...${NC}"
    
    # Check MySQL
    if ! systemctl is-active --quiet mysql; then
        send_alert "MySQL service is not running"
        log "${YELLOW}🔄 Attempting to start MySQL...${NC}"
        systemctl start mysql || send_alert "Failed to start MySQL"
    else
        log "${GREEN}✅ MySQL service is running${NC}"
    fi
    
    # Check Nginx
    if ! systemctl is-active --quiet nginx; then
        send_alert "Nginx service is not running"
        log "${YELLOW}🔄 Attempting to start Nginx...${NC}"
        systemctl start nginx || send_alert "Failed to start Nginx"
    else
        log "${GREEN}✅ Nginx service is running${NC}"
    fi
}

check_security() {
    log "${BLUE}🔒 Checking security status...${NC}"
    
    # Check for failed SSH login attempts
    FAILED_SSH=$(grep "Failed password" /var/log/auth.log | grep "$(date '+%b %d')" | wc -l)
    if [ "$FAILED_SSH" -gt 10 ]; then
        send_alert "Multiple failed SSH login attempts today: $FAILED_SSH"
    else
        log "${GREEN}✅ SSH security: $FAILED_SSH failed attempts today${NC}"
    fi
    
    # Check firewall status
    if ! ufw status | grep -q "Status: active"; then
        send_alert "UFW firewall is not active"
    else
        log "${GREEN}✅ UFW firewall is active${NC}"
    fi
    
    # Check for suspicious network connections
    SUSPICIOUS_CONNECTIONS=$(netstat -an | grep ":22 " | grep ESTABLISHED | wc -l)
    if [ "$SUSPICIOUS_CONNECTIONS" -gt 5 ]; then
        send_alert "Multiple SSH connections detected: $SUSPICIOUS_CONNECTIONS"
    fi
}

cleanup_logs() {
    log "${BLUE}🧹 Cleaning up old logs...${NC}"
    
    # Clean application logs older than 7 days
    find "$APP_PATH/logs" -name "*.log" -mtime +7 -delete 2>/dev/null || true
    
    # Clean PM2 logs
    pm2 flush
    
    # Clean system logs
    journalctl --vacuum-time=7d >/dev/null 2>&1 || true
    
    # Clean temp files
    find /tmp -type f -atime +7 -delete 2>/dev/null || true
    
    log "${GREEN}✅ Log cleanup completed${NC}"
}

update_system() {
    if [ "$1" = "--update" ]; then
        log "${BLUE}📦 Updating system packages...${NC}"
        
        apt update -y
        UPGRADABLE=$(apt list --upgradable 2>/dev/null | wc -l)
        
        if [ "$UPGRADABLE" -gt 1 ]; then
            log "${YELLOW}⬆️ $UPGRADABLE packages can be upgraded${NC}"
            # Uncomment the next line to auto-update (use with caution)
            # apt upgrade -y
        else
            log "${GREEN}✅ System is up to date${NC}"
        fi
        
        apt autoremove -y
        apt autoclean
    fi
}

backup_database() {
    if [ "$1" = "--backup" ]; then
        log "${BLUE}💾 Creating database backup...${NC}"
        
        BACKUP_DIR="/var/backups/investogold/database"
        mkdir -p "$BACKUP_DIR"
        
        BACKUP_FILE="$BACKUP_DIR/btcbot_$(date +%Y%m%d_%H%M%S).sql"
        
        if mysqldump -u btcbot_user -pAccess@404 btcbot > "$BACKUP_FILE"; then
            gzip "$BACKUP_FILE"
            log "${GREEN}✅ Database backup created: ${BACKUP_FILE}.gz${NC}"
            
            # Keep only last 7 backups
            find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
        else
            send_alert "Database backup failed"
        fi
    fi
}

generate_report() {
    log "${PURPLE}📊 Generating system report...${NC}"
    
    echo "
╔══════════════════════════════════════════════════════════════╗
║                     investogold SYSTEM REPORT                  ║
╚══════════════════════════════════════════════════════════════╝

🕐 Report Time: $(date)
🖥️  Server: $(hostname) ($(hostname -I | awk '{print $1}'))

📊 System Resources:
   • CPU Usage: ${CPU_USAGE:-N/A}%
   • Memory Usage: ${MEMORY_USAGE:-N/A}%
   • Disk Usage: ${DISK_USAGE:-N/A}%
   • Load Average: $(uptime | awk -F'load average:' '{print $2}')

🔧 Services Status:
   • MySQL: $(systemctl is-active mysql)
   • Nginx: $(systemctl is-active nginx)
   • PM2 Apps: $(pm2 list | grep -c "online" || echo "0") running

🌐 Application Status:
   • PM2 Process: $(pm2 list | grep "$APP_NAME" | awk '{print $10}' || echo "Not found")
   • HTTP Health: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health 2>/dev/null || echo "Failed")
   • Uptime: $(pm2 show "$APP_NAME" | grep uptime | awk '{print $3 " " $4}' 2>/dev/null || echo "N/A")

🔒 Security:
   • Failed SSH attempts today: ${FAILED_SSH:-N/A}
   • UFW Status: $(ufw status | head -1 | awk '{print $2}')
   • Active SSH connections: $(netstat -an | grep ":22 " | grep ESTABLISHED | wc -l)

💾 Disk Space:
$(df -h | grep -E "^/dev/")

🔄 Recent PM2 Restarts:
$(pm2 prettylist | grep -A 5 -B 5 restart 2>/dev/null | tail -10 || echo "No recent restarts")

📈 Top Processes by CPU:
$(ps aux --sort=-%cpu | head -6)

📝 Recent Application Logs:
$(tail -5 "$APP_PATH/logs/combined.log" 2>/dev/null || echo "No logs available")

════════════════════════════════════════════════════════════════
" | tee "/var/log/investogold-report-$(date +%Y%m%d).log"
}

print_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  --help        Show this help message"
    echo "  --update      Update system packages"
    echo "  --backup      Create database backup"
    echo "  --report      Generate detailed system report"
    echo "  --monitor     Run continuous monitoring (default)"
    echo "  --all         Run all checks and maintenance tasks"
}

main() {
    log "${CYAN}🚀 Starting investogold server monitoring...${NC}"
    
    case "${1:-monitor}" in
        --help)
            print_usage
            exit 0
            ;;
        --update)
            update_system --update
            ;;
        --backup)
            backup_database --backup
            ;;
        --report)
            check_system_resources
            check_application_health
            check_services
            check_security
            generate_report
            ;;
        --all)
            check_system_resources
            check_application_health
            check_services
            check_security
            cleanup_logs
            update_system --update
            backup_database --backup
            generate_report
            ;;
        --monitor|*)
            check_system_resources
            check_application_health
            check_services
            check_security
            ;;
    esac
    
    log "${CYAN}✨ Monitoring completed${NC}"
}

# Run main function with all arguments
main "$@"