This is my path of creating my project, I jumped between different topics and had to do some research on the way. This is why connected topics arent one after the other. I will try to explain my thought process and what I learned.
15 includes the visual representation of my project. 

**Structured:**
- Goal: Deploy Fullstack Web Application and Dont go Broke
    - Why? IMI Project for Threapy, Usermanagemet → Users ineract , authentification using passportJS → using Session with Cookies
    - User Research
- App Strcuture / Techstack
- → provider research
    - not very Transparent pricing → google seemed the safes
    - mongodb atlas was clear for db
    - Firbase → also google and Free - Later also tryed Vercel
- Google has a lot of Services:
    - Google Cloud Run → deploy Container → managed scaling and security → but not static IP
    - continued later
- Jumped Between tasks when I got stuck
- I Expeected to Use Terraform for everything → Turns out I didnt need it / it didnt work
- Frontend Deployment:
    - create Account → install Firebase → Use Firebase CLI → deployed → easy :)
- Database Deployment:
    - MongoDB atlas web ui → becasue terraform creation requires billing enabled
    - I got a Connection String that should stay private → fruthermore Ip whitelisting
- Now The hard Part: The backend:
    - create Dockerfile → Typescript → multistage build
        - should be small → optimised
    - had to adjust a lot in the app on the way
    - used Docker Compose to test connection to Db
    - tried Google Cloud Run Plugin → didnt work at first → got frustrated→ stopped using
    - use Terraform to configure infrastructure → start with using cli
        - idenified problems such as cookies → foudn out that firebase strips aways sessions and cookie
        - switched to vercel → same issue
        - problem was in backend code → prxoy
        - along theway a lot of misunderstdning of CORS
        - Back to Firebase
        - next thing, mongourl and sensitive data hardcoded → use Google secret manager and access with Terraform
        - in the end I connected Terraform To terraform cloud to keep my state there and make my next step easier:
- With all that Configured Continuous deployment:
- Github Actions → Firebase automaticall deployed → fixed some small issues and configured Enviroment variables
- RullRequest:
    - Firebase deploy on channel thats not live → see if frontend/ui works
    - Docker Build and Deploy with PR number as Tag → does the app Build? did it break?
    - Terraform plan → comment changes on PR
- Commit:
    - Build and Push Docker Image
    - Deploy Frontend to Live production
    - Terraform apply lastest Docker image to GCP
- What I Learned:
    - pricing of cloud providers
    - how to deploy a docker container to cloud run
    - how to deploy a frontend to firebase hosting and vercel
    - how to deploy a database to mongodb atlas
    - how to use terraform to manage infrastructure
    - how to use github actions to automate deployment
    - how to use github secrets
    - how to use google secret manager

**What I would do differently / add in the future**:

- use terraform for the database deployment
- terraform plan change to pr dockerfile
- deploy test backend container to cloud run to test Pullrequest app fully (not only frontend) - i didnt do that because i was worried about costs
- make script for whitelisting ip for mongodb atlas - not whitelist all ips
- store secrets in one place


--------------------------------------------------
Unstructured but Formatted:

1. **Initial Research**:
   - Began by researching how to deploy and comparing major cloud providers.
   - Found billing complex to understand, leading to the choice of Google's free tier with $300 credit for its simplicity.

2. **Google Cloud Deployment Options**:
   - **Google App Engine**: Easiest method for Google Cloud deployment, but lacks Docker container support.
   - **Google Kubernetes Engine**: Most complex method, but supports Docker containers.
   - **Google Compute Engine**: Offers the greatest flexibility but is the most complex.
   - **Google Cloud Run**: Simplest for deploying with Docker containers.

3. **Database and Infrastructure Management**:
   - Chose MongoDB Atlas for its ease of deploying a MongoDB database.
   - Plan to utilize Terraform for project management.

4. **Deployment Decisions**:
   - Initially felt Google Compute Engine was easiest due to its installation flexibility, but recognized difficulties in implementing HTTPS.
   - Decided to deploy the backend using Cloud Run, the frontend using Firebase Hosting, and the database with MongoDB Atlas.

5. **Backend Setup**:
   - Creating a Docker container for the backend -> Multistage Build.
   - Using Node slim to minimize container size: initially 360MB.
   - Implementing dockerignore for further size reduction.
   - Adjusting TypeScript configurations (tsconfig.json, package.json).
   - Further container optimization to 200MB with pruning.
   - Docker container now 162MB big

6. **Deployment Tools**:
   - Exploring Google Cloud Code plugin for local Cloud Run testing.
      - didnt understand how to use it
   - Using Docker Compose for testing Docker Containers -> resolving MongoDB connection issues.

7. **Database Deployment**:
   - Encountered the necessity to deploy the database first due to errors.
   - Opted for MongoDB Atlas setup via the website to avoid unintentional billing (creating with terraform need billing enabled).
   - Required application adjustments for MongoDB Atlas and new connection strings.

8. **Frontend Setup** (Reference: (https://www.freecodecamp.org/news/how-to-deploy-a-react-app-with-firebase/)):
   - Created a Firebase project and installed Firebase as a development dependency.
   - Encountered TypeScript errors during build.
   - Configured Firebase for hosting with GitHub Actions and integrated with GitHub.
   - Adjusted actions for custom builds, ignoring TypeScript errors.
   - Implemented environment variables, such as a backend URL, in functions.
   - Modified frontend fetch calls to utilize the backend URL variable.

9. **Backend Environment Variables**:
   - Need to set environment variables before deployment. (MongoDB connection string, etc.)
   - How do I get enviroment varaibles into the container?
   - Created a GitHub Action for building and pushing the Docker container to Google Cloud Container Registry.
   - Initially considered Google Container Registry, but switched to DockerHub due to unclear pricing.
   - Utilized Google Secret Manager for environment variables; found the web UI more straightforward than GitHub secrets.
   - 

10. **Further Challenges**:
    - Difficulty in understanding Google Cloud Run's UI options like CPU allocation.
    - Sought documentation for integrating Google Secret Manager with Terraform.
    - Issues in identifying IP for MongoDB Atlas access.
    - Explored scripting for IP management due to VPC not being supported in the free tier.
    - Encountered authentication issues with Cloud Run.
    - Faced challenges with passport authentication and cookies in deployment.
    - Resolved CORS errors but continued to experience cookie issues.
    - Experienced logging inconsistencies between CLI and UI.

11. **Domain Hosting Considerations**:
    - Initially attempted to combine hosting for backend and frontend due to cookie handling by Firebase.
    - Explored adding Cloud Run to Firebase Hosting and considered switching to Vercel for frontend hosting.
    - Overcame issues with cookie proxy settings.
    - Successfully redeployed using Firebase, leveraging GitHub Actions.
    - Removed Vercel deployment.
    - Planned GitHub Action for Docker build and push to DockerHub, followed by Terraform apply.
    - Tested deployments using a separate branch and removed backend logs.

12. **Terraform and GitHub Actions**:
    - Transitioned Terraform management to Terraform Cloud for ease.
    - Encountered necessity for Terraform upgrade.
    - Faced access issues with GitHub secrets during local destruction; resolved by adding them to Terraform Cloud.
    - Addressed problems with Firebase pull request deployment.
    - detroy infrastructure lcoally by logging in to terraform cloud and destroy
    - the docker Github action build and pushes on PR a docker iamge with PR tag an on commit a docker image with latest tag

13. **What I learned**:
    - pricing of cloud providers
    - how to deploy a docker container to cloud run
    - how to deploy a frontend to firebase hosting and vercel
    - how to deploy a database to mongodb atlas
    - how to use terraform to manage infrastructure
    - how to use github actions to automate deployment
    - how to use github secrets
    - how to use google secret manager

14. **What I would do differently / add in the future**:
    - use terraform for the database deployment
    - terraform plan change to pr dockerfile
    - deploy test backend container to cloud run to test Pullrequest app fully (not only frontend) - i didnt do that because i was worried about costs
    - make script for whitelisting ip for mongodb atlas - not whitelist all ips
    - store secrets in one place

15. **Visual Representation and Images**:
    - figma link: https://www.figma.com/file/yVnwSy4HVDZioFTdOb0ZAb/Devops-Project?type=whiteboard&node-id=0%3A1&t=tOjXEp9mIJ5yYqf1-1

### Here are my raw notes which I scribbled down while working on the project:

- Start with research on how to deploy and compare the big cloud providers.
- It was hard to understand the billing, that's why I decided to use the free tier of Google because it was the easiest to understand with $300 free credit.
- Now I did some research on the different ways to deploy an app on Google Cloud, I found the following options:
  - **Google App Engine** - This is the easiest way to deploy an app on Google Cloud but it is not possible to use Docker containers.
  - **Google Kubernetes Engine** - This is the most complex way to deploy an app on Google Cloud but it is possible to use Docker containers.
  - **Google Compute Engine** - This is the most flexible way to deploy an app on Google Cloud but it is the most complex way to deploy an app on Google Cloud.
  - **Google Cloud Run** - This is the easiest way to deploy an app on Google Cloud with Docker containers.
- There are also other ways to deploy an app on Google Cloud but these are the ones I considered.
- For MongoDB, I want to use MongoDB Atlas because it is the easiest way to deploy a MongoDB database.
- For this whole project, I want to use Terraform.

- I feel like Compute Engine is the easiest way to deploy an app on Google Cloud because I can install everything there, but getting HTTPS is more difficult.
- But I want to learn more, that's why I will try the following:
- I will deploy the backend using Cloud Run.
- I will deploy the frontend using static hosting with Firebase Hosting.
- I will deploy the database using MongoDB Atlas.

- I will start with the backend:
- I will create a Docker container for the backend.
- I use Node slim to reduce the size of the container.
- First container 360MB big, now 162MB big.
- Dockerignore is also used to reduce the size of the container.
- I need to adjust some TypeScript stuff like the tsconfig.json and the package.json -> write to dist and build script.
- -> Container 200MB big -> use prune to reduce the size of the container.

- I will try to use the Google Cloud Code plugin to help me deploy and test Cloud Run locally.
- Docker Compose for testing Docker containers -> because of MongoDB connection error.

- I will get the same error when I try to deploy on Google Cloud Run, that's why I need to deploy the DB first.
- I will use MongoDB Atlas for this.
- I wanted to do it with Terraform but it's only possible with a submitted payment method and I want to make sure that I don't get billed.
- So I create a MongoDB Atlas cluster on the page.
- Had to do some adjustments on the app to make it work with MongoDB Atlas and the new connection string.

[https://www.freecodecamp.org/news/how-to-deploy-a-react-app-with-firebase/](https://www.freecodecamp.org/news/how-to-deploy-a-react-app-with-firebase/)
- Frontend setup: create Firebase project.
- Install Firebase as dev dependency.
- Build project -> a lot of TypeScript errors.
- Firebase init -> hosting with GitHub Actions -> connect with GitHub.
- For testing adjust the actions to use custom build with ignoring TSC errors.
- Maybe use functions for environment variables like backend URL.
- First rewrite all frontend fetch calls to use the backend URL variable - hardcoded right now.

- Backend, how do I get environment variables into the container??
- TODO: set environment variables before using deploy action.
- Created a GitHub action to build and push Docker container to Google Cloud Container Registry.
- First test manually build and push to container registry: 
  - docker build -t gcr.io/imi-b4/hypnobuddy-backend:test .
  - I decided against GCR because pricing was way too intransparent, so I use Docker Hub.
- Problem with environment variables -> use Google Secret Manager / could do it with GitHub secrets but using the UI is easier.
- First, I looked at the web UI to create a Cloud Run service and I found it really intimidating because there were options like CPU allocation and pricing which I didn't find in the Terraform docs.
- Then I found the current Google doc which also provides Terraform examples.
- Couldn't understand how to use Google Secret Manager with Terraform so looked up documentation.
- Next issue was finding out the IP to grant access to the database at MongoDB Atlas.
- VPC is not supported by the free tier - so I will try to create a script that runs before the server is started to get the IP and grant access.
- In the frontend, I don't have the problem because I can use the URL of the service.
- The Cloud Run denied the request because it was not authenticated - how can I auth? Actually, the app was set that I need to auth - I was worried to change that because when I launched a few requests from Telegram bots

 were logged and I didn't want to slide into a paid tier.
- The communication works but somehow my passport auth stuff is not working anymore.
- I think it has something to do with cookies.
- After setting cookies to secure and going from my HTTPS, I got a CORS error.
- After solving the CORS error from the deployment by using origin true, I still had the cookie issue.
- Now I didn't get any logs anymore, I don't know why - this was a big issue because from the CLI I got the latest logs but not in the UI - even after redeploying it didn't work.
- Next idea do hosting and backend on the same domain because cookies get stripped by Firebase.
- Next: add Cloud Run to Firebase hosting -> activate Cloud Run API.
- Yet, rather switch to Vercel for frontend hosting.

- Vercel seemed very easy to use but I had some issues with the Vite directory structure -> modify build command.
- After some more digging on StackOverflow, I found a post that said I need to set the cookie proxy to true which made the whole thing work.
- Now I will try to deploy using Firebase again because I have the GitHub actions for it -> it works.
- Removed Vercel again using CLI.
- Next step is GitHub action for Docker build and push to Docker Hub, Terraform plan & apply.
- The Terraform plan should comment the plan on the PR.
- Then test those with a separate branch.
- Remove all the logs from the backend.

- With GitHub actions, I had some issues with Terraform so I moved that to Terraform Cloud to make it easier.
- Problem: Terraform upgrade needed.
- When destroying locally no access to GitHub secrets, the variable GCP.
- Add in Terraform Cloud.
- Firebase pull request deploy has issues too.
- adjusted docker github action to build and push on PR a docker iamge with PR tag an on commit a docker image with latest tag