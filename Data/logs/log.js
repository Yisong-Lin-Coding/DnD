const fs = require('fs');
const path = require('path');

// Optional: use a logs folder
const logDir = './Data/logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

module.exports = (message, context = "general") => {
    const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${context.toUpperCase()}] ${message}\n`;

  // Print to console
  console.log(logMessage.trim());

  // Save to log file
    if(context !== "general"){
        const filePath2 = path.join(logDir, `general.log`);
        fs.appendFileSync(filePath2, logMessage, 'utf8');
    }

  const filePath = path.join(logDir, `${context}.log`);
  fs.appendFileSync(filePath, logMessage, 'utf8');
  

}
