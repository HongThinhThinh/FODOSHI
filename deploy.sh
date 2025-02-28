echo "Building app..."
npm run build --force


echo "Deploying files to server..."
scp -r dist/* root@14.225.217.181:/var/www/html/

echo "Deployment Successful!"

# //IK5hkvIhW2oPALb1%M
