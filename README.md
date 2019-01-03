# ctrbot-dialogflow
CTRBot based on Dialogflow

## Deployment

```sh
gcloud beta functions deploy webhookHandler --runtime nodejs8 --trigger-http --memory 128MB --env-vars-file .env.yaml
```
