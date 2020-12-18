# Unity Forms Application Template

# Backend development

## Run & Debug with static ui

* build application 
    ```shell script
    mvn clean package
    ```
* run spring boot application using
    * profiles: _external-application, local, debug-authentication_  
    * VM options: _-Dspring.resources.static-locations=file:/C:/**<path_to_epermitting_project>**/epermitting-ui/target/epermitting-ui-1.0.0-SNAPSHOT_
    
* go to: http://localhost:8091/login?token=<token>
    where token is your safe encoded user name. 
    
        For example: cn%3Ddshakhovkin%2Cou%3DPeople%2Cdc%3Depermit%2Cdc%3Dcom

# UI Development guide
 
## Prerequisites

* You’ll need to have Node >= 8.10 on your local development machine. 
Download and install nodejs - https://nodejs.org/en/download/

* Install yarn:
```npm install -g yarn```

* Install create-react-app tool:
```npm -g install create-react-app```

* Setup Intellective NPM repository:   
    1. [Encrypt](https://help.sonatype.com/repomanager3/formats/npm-registry#npmRegistry-AuthenticationUsingBasicAuth) your Intellective credentials in the following format: **intellective_email:password**.
    2. Put encrypted string into your ~/.npmrc file (create if absent)
        ```text
        email=ichukanov@intellective.com 
        always-auth=true 
        _auth=INSERT_ENCRYPTED_PASSWORD_HERE
        ```
        **Note: .npmrc should be in the user home directory.**
    3. Run command, 
        ```sh
        npm set @intellective:registry https://npm.intellective.com/repository/npm-main/
       ```
     
    Check your .npmrc file, it should look like the following:

    ```text
     @intellective:registry=https://npm.intellective.com/repository/npm-main/
     email=!your-id@intellective.com
     always-auth=true
     _auth=[YOUR_ENCRYPTED_CREDENTIALS]
    ```
## Usage
   
* Install project dependencies:
    ```yarn install```   
    
## Run dev sever
You need to run both: Mock server and Development server in separated terminals

    yarn start
    yarn server
    
If you use VS Code. 
* Go to package.json file.
* Find _Scripts_ block. Right click on a line -> _Run Script_  

**Note: server requires dev dependencies to be installed.** <br/>

Run the following command to install dev dependencies:
`yarn add --dev http-proxy-middleware express body-parser faker file-loader node-rsql-parser sqlite3 uuid`

# Available Scripts

In the project directory, you can run:

### `yarn server`

Runs the mock server that comes with the app and allows creating UI components with zero dependencies on backend systems.<br />

The server has (mock) implementations of the Unity API based on (fake) generated data.

By default, the server is available by [http://localhost:4000](http://localhost:4000). <br/>

**Note: server requires dev dependencies to be installed.** <br/>

Run the following command to install dev dependencies:
`yarn add --dev http-proxy-middleware express body-parser faker file-loader node-rsql-parser sqlite3 uuid`

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />

**Note: in order to start the app in dev mode, it requires a proxy to the Unity API**

Check out the default proxy configuration in `src/setupProxy.js`. 

### `mvn clean install`

This command builds a standalone spring boot application for production use. <br>

It also creates a bundle (jar file) containing only UI scripts that can be used to assemble the Unity App with the provided react-template. <br/> 