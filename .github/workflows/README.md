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
- only on `main`
- only on files changed in `kdl-client/**`

## Publish Desktop App

Build and publish the desktop app for all platforms (linux, windows and mac).

Conditions:
- Manual 
- On success execution of a release workflow
