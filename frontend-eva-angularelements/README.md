
[![N|Solid](https://i.ibb.co/LtT31vK/eva-150px.png)](https://eva.bot/)

# Eva Frontend
## With Angular Elements Component
##

This document explains the necessary steps for the web frontend deployment connected to a eva bot.

The frontend is developed in the Angular 7 framework with Angular Elements web component wich allows to include new HTML elements into a site, independent from framework.

## Previous Requeriments

- Angular 7
- Package install static-server
- Amazon AWS account

## Frontend web configuration

- Have an IDE (as Visual Studio Code) to view the source code:
![N|Solid](https://storage.googleapis.com/open-integration-library/visual_studio_ide.png)

- Open the project frontend-eva and open the terminal.

- Execute the followings commands:
    ```sh
    npm install
    ng serve
    ng start
    ng build
    ```

## AWS account configuration

Security credentials allow authorizing and associating the web frontend to AWS account. For this, do the following:

- In the top right menu, go to the option "My Security Credentials":
![N|Solid](https://storage.googleapis.com/open-integration-library/my_security_credentials.png)

- Then, select the option "Access keys (access key ID and secret access key)" and click in the button "Create New Access Key":
![N|Solid](https://storage.googleapis.com/open-integration-library/access_keys.png)

- Click in the button "Download Key File" (download the file for using after):
![N|Solid](https://storage.googleapis.com/open-integration-library/create_access_key.png)

For establish a connection between the web frontend and the bot must to create and configurate a parameter store inside AWS:

- First, enter to the AWS administration console and insert the credential acess:
![N|Solid](https://storage.googleapis.com/open-integration-library/aws_managements_console_login.png)

- Then, it will show the following screen:
![N|Solid](https://storage.googleapis.com/open-integration-library/aws_management_console.png)

- Find the option "Systems Manager":
![N|Solid](https://storage.googleapis.com/open-integration-library/find_systems_manager.png)

- Then, select from the side menu the option "Parameter store".
![N|Solid](https://storage.googleapis.com/open-integration-library/select_parameter_store.png)

- In this option, create a new parameter:
![N|Solid](https://storage.googleapis.com/open-integration-library/create_parameter.png)
![N|Solid](https://storage.googleapis.com/open-integration-library/creating_parameter.png)

- Once all the fields have been configured, click in the button "Create parameter" and it will show the parameter created:
![N|Solid](https://storage.googleapis.com/open-integration-library/created_parameter.png)

## Web Frontend Configuration

- Open the local-config.service.ts file located in the path src/app/chat/services:
![N|Solid](https://storage.googleapis.com/open-integration-library/local_config_service_vstudio.png)

- Add the two parameters generated in the option "Access Key" of AWS account:
    ```sh
     AWS.config.region = 'sa-east-1';
     let cred1 = 'Input_AccessKeyId';
     let cred2 = 'Input_AWSSecretKey';
    ```
    The parameter AWS.config.region appears in the option "Last Used Region" of the generated Access Key ID.
    
- Then, go to the variable awsParamStore.getParameter and add the path of the parameter created. For example:

    ![N|Solid](https://storage.googleapis.com/open-integration-library/parameter_example.png)

    ```sh
    awsParamStore.getParameter( '/app/evachat/apikeydata', { region: 'sa-east-1' } )
    ```

## Angular Elements Generation

- Execute the following command for build the web component:
    ```sh
    npm run build:elements
    ```
    ![N|Solid](https://storage.googleapis.com/open-integration-library/npm_run_build_elements_executing.png)
    This will generate a folder under the root folder called "elements":
    ![N|Solid](https://storage.googleapis.com/open-integration-library/elements_folder.png)
    This folder contains the files "eva-frontend.js" and "styles.css":
    ![N|Solid](https://storage.googleapis.com/open-integration-library/elements_folder_details.png)
    
- For finish, copy the folder "assets" from the compiled project (dist) into the folder "elements" of the web component:
![N|Solid](https://storage.googleapis.com/open-integration-library/assets_dist.png)
![N|Solid](https://storage.googleapis.com/open-integration-library/assets_elements.png)

- For testing the web component, go to the path of the folder "elements" and execute the following command:
    ```sh
    static-server
    ```
    Note: In case that static-server isn't configured, must to install it as described in https://www.npmjs.com/package/static-server
    
    ![N|Solid](https://storage.googleapis.com/open-integration-library/static_server_executing.png)

## Publicate the web component in AWS





