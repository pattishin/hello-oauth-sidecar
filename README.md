# Hello Login OAuth Cloud Run Side-car

```bash
export PROJECT_ID=<your-project-id>
export REGION=us-central1
export REPO_NAME=hello-login-repo

# Enable apis
gcloud services enable \
    artifactregistry.googleapis.com \
    run.googleapis.com

    # Create your Artifact Repository repo
gcloud artifacts repositories create $REPO_NAME \
    --repository-format=docker \
    --location=$REGION --description="Login OAuth repository"

# In client folder, push hello-login-app image to AR
gcloud builds submit \
    --project $PROJECT_ID \
    --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/hello-login-app client/

# In server folder, Push oauth server image to AR
gcloud builds submit \
    --project $PROJECT_ID \
    --tag $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/oauth-server auth-server/

# Run service with new oauth side-car
gcloud run services replace service.yaml
```
