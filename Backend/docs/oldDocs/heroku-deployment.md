---
title: Heroku Deployment (Old)
description: Old manual Heroku deploy steps (login, git remote, migrations, pushing a version). The backend no longer deploys to Heroku.
---

# Heroku Installment

The deployment process based on the manual action. To have it done you should install heroku locally.

`brew tap heroku/brew && brew install heroku`

## Heroku Login

`heroku login`

## Set Heroku Git

`git remote add heroku https://git.heroku.com/ct-test-env-middlewate.git`

## Migration

The migration running automatically during pushing new version

## Pushing New Version

`git push heroku dev_v1:main`
