# MangBeli-API

This is the backend side for the MangBeli Application, a Capstone Project Bangkit Academy 2023 H2.

## Cloud Preparation:

### Google Cloud Storage Bucket:

- Create a Google Cloud Storage Bucket with Public Access.
    - Bucket settings:
        | Setting                                         | Value        |
        | ----------------------------------------------- | ------------ |
        | Enforce public access prevention on this bucket | Uncheck      |
        | Access control                                  | Fine-grained |

    - Add Permissions to `allUsers` with role `Storage Object Viewer`.

        ![Bucket settings](https://media.discordapp.net/attachments/880802395414736916/1187666072929841202/image.png?ex=6597b739&is=65854239&hm=01a1b6e040862da2ae5300d00508f4b6e9855965009fd7f0285ce58efca6c0c7&=&format=webp&quality=lossless)

- Create a Google Cloud Storage Bucket Service Account for image upload and deletion.
    - You can make a custom role `storageObjectUploaderDeleter` with permissions `storage.objects.create` and `storage.objects.delete`.

        ![Custom role](https://media.discordapp.net/attachments/880802395414736916/1187669218167111760/image.png?ex=6597ba27&is=65854527&hm=2e71ed5a65cd436e35e7937faee772cb968e6e97d137f5037d54ca6df73d53f2&=&format=webp&quality=lossless)
    - Alternatively, use the predefined role `Storage Object Admin`.

        ![Predefined role](https://media.discordapp.net/attachments/880802395414736916/1187669715393462272/image.png?ex=6597ba9d&is=6585459d&hm=b14ae5166dcfb51802366ea412951a3357053dac64f9028b73e4c9c1ab654693&=&format=webp&quality=lossless)

    - Manage keys -> KEYS -> ADD KEY -> JSON -> Download -> Move to the API directory and rename to `credentials-bucket.json`.

### Google Cloud SQL MySQL Instance:

- Create a Google Cloud SQL MySQL instance.
    - Set Connections to `Public IP` and add a new network.

    - Network Settings:
        - Name: `Public`
        - Network: `0.0.0.0/0`

        ![Public IP](https://media.discordapp.net/attachments/880802395414736916/1187670326792945674/image.png?ex=6597bb2f&is=6585462f&hm=9ee8aeea0970df747a61bcfe65ca365af1acaa13fb2772a42b8c50e514309d22&=&format=webp&quality=lossless)

- Connect to MySQL instance to create a database and table (table columns documented [here](https://bangkit-capstone-ch2-ps124-team.github.io/mangbeli-api-doc/#/?id=database)).

### Firebase:

- Create a Firebase project.
    - Project settings -> Cloud Messaging -> Manage Service Accounts -> Manage keys -> KEYS -> ADD KEY -> JSON -> Download.
    - Move the downloaded file to the API directory and rename it to `credentials-firebase.json`.

    ![FCM](https://media.discordapp.net/attachments/880802395414736916/1187670657048264704/Screenshot_2023-12-21_1838051.png?ex=6597bb7e&is=6585467e&hm=eafdf2cce8362a6c1a0fd212e1f4cab92baa6675c7b3743f56cadd6be64e8caf&=&format=webp&quality=lossless&width=767&height=499)

### Google Maps Platform:

- Enable Maps SDK for Android API and Directions API on [Google Maps Platform](https://console.cloud.google.com/google/maps-apis/api-list).
    - Create Credentials -> API key -> Optionally set Restrictions -> Provide the key to the MD team.

### Environment Variables:

- Create a `.env` file based on the template `env.example`:

    ```
    PORT=Your_API_Port
    DB_NAME=Your_Database_Name
    DB_HOST=Public_IP_of_Your_Cloud_SQL_Instance
    DB_USER=root
    DB_PASSWORD=Your_Database_Password
    DB_DIALECT=mysql
    ACCESS_TOKEN_SECRET=Random_String (recommended 32 characters long with upper case, lower case, and number)
    REFRESH_TOKEN_SECRET=Random_String (recommended 32 characters long with upper case, lower case, and number)
    BUCKET_NAME=Your_Storage_Bucket_Name
    ```

## File Tree Structure:

```
.
└── mangbeli-api/
    ├── node_modules/
    ├── src/
    ├── .dockerignore
    ├── .env
    ├── .eslintrc.json
    ├── .gitignore
    ├── credentials-bucket.json
    ├── credentials-firebase.json
    ├── Dockerfile
    ├── .env.example
    ├── package-lock.json
    ├── package.json
    └── README.md
```

## Running Locally:
To run the project locally and without Docker, use the following commands:
```bash
npm i
npm start
```

## Running and Deploying in Google Cloud Run:
1. Open the Cloud Shell
2. Clone this repository
3. Perform [Cloud Preparation](#cloud-preparation) steps.
4. Build the Docker image: `docker build -t <CONTAINER_NAME> .`
5. Tag the Docker image: `docker tag <CONTAINER_NAME> gcr.io/<PROJECT_ID>/<CONTAINER_NAME>`
6. Push the Docker image to Google Container Registry: `docker push gcr.io/<PROJECT_ID>/<CONTAINER_NAME>`
7. Deploy to Google Cloud Run:

    ```
    gcloud run deploy <CONTAINER_NAME> \
        --image gcr.io/<PROJECT_ID>/<CONTAINER_NAME> \
        --platform managed \
        --region=asia-southeast2 \
        --allow-unauthenticated \
        --cpu=1 \
        --memory=1Gi
    ```

## Documentation and Endpoints:
[MangBeli API Doc](https://bangkit-capstone-ch2-ps124-team.github.io/mangbeli-api-doc/)
