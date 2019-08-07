#!/bin/bash
sed -i '' "s/AI.*sUc/circleCiApiKey/g" src/app/api-keys.ts 
sed -i '' "s/mar.*com/administratorEmail/g" cypress/fixtures/cypressConstants.json
sed -i '' "s/AP.*1/administratorPassword/g" cypress/fixtures/cypressConstants.json
# git commit -am "change sensitive info"
git push origin master
cp ~/Desktop/api-keys.ts ./src/app/
cp ~/Desktop/cypressConstants.json ./cypress/fixtures/
