const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();

app.get('/run-script', (req, res) => {
    console.log('=== DEBUG: /run-script endpoint called ===');
    console.log('Current working directory:', process.cwd());
    console.log('Script path:', path.resolve('./your_script.sh'));
    console.log('About to execute script...');
    
    const startTime = Date.now();
    exec('./your_script.sh', { cwd: __dirname, timeout: 5000 }, (error, stdout, stderr) => {
        const endTime = Date.now();
        console.log('=== EXEC RESULTS ===');
        console.log('Execution time:', (endTime - startTime), 'ms');
        console.log('Error:', error);
        console.log('Stdout length:', stdout ? stdout.length : 0);
        console.log('Stdout content:', JSON.stringify(stdout));
        console.log('Stderr length:', stderr ? stderr.length : 0);
        console.log('Stderr content:', JSON.stringify(stderr));
        console.log('===================');
        
        if (error) {
            console.error('Script execution failed:');
            console.error('Error code:', error.code);
            console.error('Error signal:', error.signal);
            console.error('Error message:', error.message);
            res.status(500).send(`Error: ${error.message}`);
            return;
        }
        
        const result = stdout || stderr || 'Script executed successfully (no output)';
        console.log('Sending response:', JSON.stringify(result));
        res.send(result);
    });
});

// Add static file serving for HTML/CSS/JS
app.use(express.static('.'));

app.listen(8080, () => {
    console.log('Server running on port 8080');
    console.log('Access your login page at: http://localhost:8080/login.htm');
});
