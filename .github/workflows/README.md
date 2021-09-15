# Workflows

These are the workflows defined in the repository, in logical order of execution:

1. PR Checks
3. Release
4. Publish Desktop App

## PR Checks

Checks the code against Sonar Cloud.

Conditions:

- Runs on pull requests

## Release

Generates a new release tag and releases notes with semantic release.

Conditions:

- Only on `main` branch when changes are made inside `kdl-client/` folder

## Publish Desktop App

Build and publish the desktop app for all platforms (linux, windows and mac).

Conditions:

- Manual 
- On success execution of a release workflow
