#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const yargs = require('yargs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process')

// Parse the command-line arguments
const {
  _: [name],
  path,
} = yargs.argv

const migrationsDir = 'src/migrations'

// Construct the migration path
const migrationPath = `${migrationsDir}/${name}`

// Run the typeorm command
execSync(
  `typeorm-ts-node-commonjs migration:create ${migrationPath} && eslint --rule "@typescript-eslint/require-await: 0" --rule "@typescript-eslint/no-unused-vars: 0" "${migrationsDir}/**/*${name}.ts" --fix`,
  {
    stdio: 'inherit',
  },
)
