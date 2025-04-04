echo "Building app..."
npm run build --force


echo "Deploying files to server..."
# //fodoshi
# scp -r dist/* root@14.225.217.181:/var/www/html/
scp -r dist/* root@104.131.172.213:/var/www/html/


echo "Deployment Successful!"

# //IK5hkvIhW2oPALb1%M
