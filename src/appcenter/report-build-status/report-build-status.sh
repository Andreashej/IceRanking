#!/bin/bash
umask 0000
/bin/bash
 
# some comment
set -e

npm install -g appcenter-cli@1.2.2
 
# login in APPCENTER with the token from github secrets
appcenter login --token $APPCENTER_API_TOKEN
 
# remove the leading refs/heads/ string that github adds to the branch name
BRANCH_NAME=${GITHUB_REF##*refs/heads/}
 
# queue a new build in APPCENTER for the current branch and get the id
APPCENTER_BUILD_ID=$(appcenter build queue --app $APPCENTER_OWNER_NAME/$APPCENTER_APP_NAME --branch $BRANCH_NAME --source-version $GITHUB_SHA --output json | jq -r .buildId)
echo "STARTED THE BUILD WITH ID $APPCENTER_BUILD_ID ON APPCENTER"
RUNNING=true
 
sleep 10
 
# APPCENTER_STATUS_COMPLETED = "completed"
# APPCENTER_STATUS_NOT_STARTED = "notStarted"
# APPCENTER_BUILD_SUCCESSFUL = "succeeded"
 
while $RUNNING; do
  # use appcenter api to get the build status for a specific build id
  APPCENTER_BUILD_RESPONSE=$(curl -X GET --header 'Content-Type: application/json' \
    --header 'Accept: application/json' \
    --header "X-API-Token: ${APPCENTER_API_TOKEN}" \
    "https://api.appcenter.ms/v0.1/apps/${APPCENTER_OWNER_NAME}/${APPCENTER_APP_NAME}/builds/${APPCENTER_BUILD_ID}")
 
  # since the response is in JSON format, use jq to parse it (https://stedolan.github.io/jq/)
  # jq -r for raw output, result without quotes
  APPCENTER_BUILD_STATUS=$(echo "$APPCENTER_BUILD_RESPONSE" | jq -r .status)
  echo $APPCENTER_BUILD_STATUS
 
  if [ "$APPCENTER_BUILD_STATUS" == "completed" ]; then
    RUNNING=false
 
    # similar to APPCENTER_BUILD_STATUS
    APPCENTER_BUILD_RESULT=$(echo "$APPCENTER_BUILD_RESPONSE" | jq -r .result)
    echo $APPCENTER_BUILD_RESULT
 
    if [ $APPCENTER_BUILD_RESULT = "succeeded" ]; then
      echo "THE BUILD SUCCEEDED ON APPCENTER: $APPCENTER_BUILD_RESULT"
      # exit code 0 means success in github
      exit 0
    else
      echo "THE BUILD FAILED ON APPCENTER: $APPCENTER_BUILD_RESULT"
      # any exit code that is not 0 (success) or 78 (neutral) means failure in github
      exit 1
    fi
  fi
  sleep 30
done