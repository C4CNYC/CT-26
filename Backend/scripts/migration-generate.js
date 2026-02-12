#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const yargs = require('yargs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const {
  loadingAnimation,
  finishLoadingAnimation,
  finishLoaderAnimationWithError,
} = require('./loading-animation')

// Parse the command-line arguments
const {
  _: [name],
} = yargs.argv

const migrationsDir = 'src/migrations'

// Construct the migration path
const migrationPath = `${migrationsDir}/${name}`
const timestamp = new Date().getTime()

// Start the loading animation
const loadingInterval = loadingAnimation(
  `Generating migration: ${timestamp}-${name}.ts`,
)

async function runMigration() {
  await exec(
    `yarn typeorm migration:generate ${migrationPath} -t ${timestamp}`,
    (err) => {
      if (err) {
        finishLoaderAnimationWithError(loadingInterval, err)
        return
      }

      try {
        const createdMigrationPath = path.join(
          __dirname,
          `../${migrationsDir}/${timestamp}-${name}.ts`,
        )

        exec(
          `eslint --rule "@typescript-eslint/require-await: 0" --rule "@typescript-eslint/no-unused-vars: 0" "${createdMigrationPath}" --fix`,
        )

        finishLoadingAnimation(loadingInterval)
        console.log(`Migration generated successfully: ${createdMigrationPath}`)
      } catch (e) {
        finishLoaderAnimationWithError(loadingInterval)
        console.error(e)
      }
    },
  )
}

runMigration()
