# ctrbot-dialogflow
CTRBot based on Dialogflow

# Setup
Run `npm i` to install all dependencies

# Scripts
## Development
Run `npm run start:local` to run application on local environment

To enable watch mode (after the initial build it will continue to transpile TypesScript to JavaScript and listen to it changes) <br/> run these to commands in a separate terminals:

1) `npm run watch-ts` to watch TypesScript changes
2) `npm run watch-node` to watch compiled JavaScript changes

## Deployment

```sh
gcloud beta functions deploy webhookHandler --runtime nodejs8 --trigger-http --memory 128MB --env-vars-file .env.yaml
```
