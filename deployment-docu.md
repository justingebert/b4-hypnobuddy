- start with research on how to deploy and compared the big cloud providers
- it was hard to understand the billig thats why i decided to use the free tier of google because it was the easiest to understand with 300$ free credit
- now I did some reasearch on the different ways how to deploy an app on google cloud i found the follwojg options:
  - **google app engine** - this is the easiest way to deploy an app on google cloud but it is not possible to use docker containers
  - **google kubernetes engine** - this is the most complex way to deploy an app on google cloud but it is possible to use docker containers
  - **google Compute Engine** - this is the most flexible way to deploy an app on google cloud but it is the most complex way to deploy an app on google cloud
  - g**oogle cloud run** - this is the easiest way to deploy an app on google cloud with docker containers
- there are also other ways to deploy an app on google cloud but these are the ones I considered
- for mongodb i want to use mongodb atlas because it is the easiest way to deploy a mongodb database
- for this whole project i want to use terraform

- i feel like compute engine is the easiest way to deploy an app on google cloud because i can install everything there but getting HTTPS is more difficult
- but i want to learn more that why i Will try the following:
- i will deploy the backend using cloud run
- i will deploy the frontend using static hosting with firebase hosting
- i will deploy the database using mongodb atlas

- i will start with the backend:
- i will create a docker container for the backend
- I use node slim to reduce the size of the container
- first container 360mb biog now 162mb big
- dockerignore is also used to reduce the size of the container
- i need to adjust some typescritp stuff like the tsconfig.json and the package.json -> write tot dist and build script
- -> container 200mb big -> use prune to reduce the size of the container

- i will try to use the google cloud code plugin to help me deploy and test cloud run locally
- docker compose for testing docker containers -> becasue of mongodb connection error

- i will get the same error when i try to deploy on google cloud run that why i need to deploy the db first
- i will use mongodb atlas for this 
- i wanted to do it with terraform but its only possible with a submitted payment method and i want to make sure that i dont get billed
- so i createa a mondodb atlas cluster on the page 
- had to do some adjustments on the app to make it work with mongodb atlas and the new connection string

https://www.freecodecamp.org/news/how-to-deploy-a-react-app-with-firebase/
- frontend setup: create firebase project
- install firebase as dev dependency
- build project -> a lot of typescipt errors
- fireabse init -> hosting with github actions -> connect with github
- for testing adjust the actions to use custom build with ignoring tsc errors
- 