#!/bin/bash
sed -i '' "s/AI.*sUc/circleCiApiKey/g" src/app/api-keys.ts 
git push origin master
