
#!/bin/bash
# Simple script to start the project since we can't modify package.json

echo "Starting the project..."
npm run start || npx vite
