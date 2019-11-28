#!/bin/bash
umask 0000
/bin/bash
 
# some comment
set -e

# Ensure Microsoft AppCenter CLI installed
if hash appcenter 2>/dev/null; then
  echo "Microsoft AppCenter CLI already installed."
else
  echo "Microsoft AppCenter CLI is not installed. Installing...."
  npm install -g appcenter-cli
fi

# do not upload symbols to AppCenter if BRANCH_NAME is develop or feature, as they are not built with InHouse Provisioning
if [[  ("$APPCENTER_BRANCH" = "feature/"*) || ("$APPCENTER_BRANCH" = "develop") ]]; then
 
  echo "Not uploading symbols for $APPCENTER_BRANCH"

   # exit code 78 is neutral
  exit 78
fi

echo "Uploading symbols to appcenter"
appcenter crashes upload-symbols -s "$APPCENTER_OUTPUT_DIRECTORY/../symbols/$APPCENTER_XCODE_SCHEME.app.dSYM" -a "$APPCENTER_OWNER_NAME/$APPCENTER_APP_NAME" --token $APPCENTER_API_TOKEN

exit 0