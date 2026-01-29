import { test as setup } from '@playwright/test';
import { LoginPage } from '../page-objects/pages/LoginPage';
import path from 'path/win32';

const authFile = path.resolve('playwright/.auth/user.json');
setup('authenticate', async ({ page }) => {
    let capturedToken = '';

// Listen to all outgoing requests from the browser to the server    
    page.on('request', request => {
        const headers = request.headers();
        
// Check if the request contains an Authorization header
        if (headers['authorization'] && headers['authorization'].startsWith('Bearer ')) {
            const token = headers['authorization'].replace('Bearer ', '');
            
// Validate if the token is long enough and follows the JWT structure (contains dots)
            if (token.length > 50 && token.includes('.')) {
                capturedToken = token;
                process.env.FINAL_TOKEN = token;
            }
        }
    });

await page.goto('/Kaleidoo_AI');
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await page.waitForURL('**/assist');
    await page.waitForTimeout(2000);  

// Wait for the page to finish loading all API calls (e.g., get_roles) to ensure the Authorization header is intercepted.
    await page.waitForLoadState('networkidle');

    if (process.env.FINAL_TOKEN) {
        console.log('✅ SUCCESS: Captured JWT Token from outgoing request headers!');
    } else {
        console.error('❌ FAILURE: Token not found in any request headers.');
    }

    await page.context().storageState({ path: authFile });
 
    const fs = require('fs');
    const storage = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
    
    storage.origins[0].localStorage.push({
        name: 'raw_token',
        value: process.env.FINAL_TOKEN
    });
    
    fs.writeFileSync(authFile, JSON.stringify(storage, null, 2));
    console.log('✅ Clean token saved to user.json');


});