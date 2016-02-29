# Get Start
    # Install
    npm install fis3 -gd
    npm install
    
    # Start dev server, modify mock data in test/apis.json
    fis3 release -w
    fis3 server start -p 8080 --type node
    
    # Deploy to ../dist, compress js/css
    fis3 release deploy