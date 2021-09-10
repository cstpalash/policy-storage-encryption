FROM public.ecr.aws/lambda/nodejs:14

# Assumes your function is named "app.js", and there is a package.json file in the app directory 
COPY app.js package.json  /var/task

# Install NPM dependencies for function
RUN npm install

CMD [ "app.handler" ]