<p align="center">
  <a href="https://github.com/microsoft/setup-msstore-cli/actions"><img alt="setup-msstore-cli status" src="https://github.com/microsoft/setup-msstore-cli/workflows/build-test/badge.svg"></a>
</p>

# Setup MSStore Developer CLI

This repository contains the source code for the `setup-msstore-cli` GitHub Action as well as the `setup-msstore-cli` Azure DevOps extension.

This action/extension sets up the [MSStore Developer CLI](https://github.com/microsoft/msstore-cli) on a runner/agent.
The MSStore Developer CLI is a command line interface that allows you to manage your Microsoft Store apps and in-app products.

Example (GitHub Action):
  
```yaml
name: MSStore CLI
on: [push]
jobs:
  build:
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v3
    - uses: microsoft/setup-msstore-cli@v1
    - run: msstore reconfigure --tenantId ${{ secrets.MSSTORE_TENANT_ID }} --sellerId ${{ secrets.MSSTORE_SELLER_ID }} --clientId ${{ secrets.MSSTORE_CLIENT_ID }} --clientSecret ${{ secrets.MSSTORE_CLIENT_SECRET
    - run: msstore apps list
```

Example (Azure DevOps extension):
  
```yaml
name: MSStore CLI
trigger:
- main
pool:
  vmImage: 'windows-latest'
steps:
- checkout: self
- task: MicrosoftStoreDeveloperCLISetup@0
- script: msstore reconfigure --tenantId ${{ secrets.MSSTORE_TENANT_ID }} --sellerId ${{ secrets.MSSTORE_SELLER_ID }} --clientId ${{ secrets.MSSTORE_CLIENT_ID }} --clientSecret ${{ secrets.MSSTORE_CLIENT_SECRET
- script: msstore apps list
```