#!/bin/bash
umask 0000
/bin/bash
 
# some comment
set -e

# do not upload symbols to AppCenter if BRANCH_NAME is develop or feature, as they are not built with InHouse Provisioning
if [[  ("$APPCENTER_BRANCH" = "feature/"*) || ("$APPCENTER_BRANCH" = "develop") ]]; then
 
  echo "Not uploading symbols for $APPCENTER_BRANCH"

   # exit code 78 is neutral
  exit 78
fi

echo "Uploading symbols to appcenter"
appcenter crashes upload-symbols -s "$APPCENTER_OUTPUT_DIRECTORY/../symbols/$APPCENTER_XCODE_SCHEME.app.dSYM" -a "$APPCENTER_OWNER_NAME/$APPCENTER_APP_NAME" --token $APPCENTER_API_TOKEN

exit 0