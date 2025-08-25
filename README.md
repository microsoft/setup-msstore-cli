# Publish Windows App to Microsoft Store

<p align="center">
  <a href="https://github.com/microsoft/setup-msstore-cli/actions"><img alt="setup-msstore-cli status" src="https://github.com/microsoft/setup-msstore-cli/workflows/build-test/badge.svg"></a>
</p>

This repository contains the source code for the **Publish Windows App to Microsoft Store** GitHub Action as well as the Azure DevOps extension.

This action/extension enables automated publishing of Windows applications to the Microsoft Store. It sets up the [MSStore Developer CLI](https://github.com/microsoft/msstore-cli) and provides seamless CI/CD integration for Windows app publishing workflows, supporting MSIX, AppX, and other Windows package formats.

## 🚀 Key Features

✅ **Automated Windows App Publishing** - Publish MSIX, AppX, and other Windows packages directly to the Store  
✅ **CI/CD Integration** - Seamless publishing workflows with GitHub Actions and Azure DevOps  
✅ **Store Management** - Update metadata, screenshots, descriptions, and app listings  
✅ **Secure Configuration** - Use GitHub secrets for Partner Center credentials  
✅ **Status Monitoring** - Track publishing progress and submission status in real-time  
✅ **Multi-format Support** - Works with all Windows app package types  

## Quick Start - Publishing a Windows App

```yaml
name: Publish Windows App to Microsoft Store
on: 
  release:
    types: [published]
jobs:
  publish-to-store:
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v3
    - uses: microsoft/setup-msstore-cli@v1.1
    - run: msstore reconfigure --tenantId ${{ secrets.PARTNER_CENTER_TENANT_ID }} --sellerId ${{ secrets.PARTNER_CENTER_SELLER_ID }} --clientId ${{ secrets.PARTNER_CENTER_CLIENT_ID }} --clientSecret ${{ secrets.PARTNER_CENTER_CLIENT_SECRET }}
    - run: msstore apps publish --app-id ${{ secrets.APP_ID }} --package-path ./dist/MyWindowsApp.msix
```

## Basic Setup Example

```yaml
name: Setup MSStore CLI
on: [push]
jobs:
  setup:
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v3
    - uses: microsoft/setup-msstore-cli@v1.1
    - run: msstore reconfigure --tenantId ${{ secrets.PARTNER_CENTER_TENANT_ID }} --sellerId ${{ secrets.PARTNER_CENTER_SELLER_ID }} --clientId ${{ secrets.PARTNER_CENTER_CLIENT_ID }} --clientSecret ${{ secrets.PARTNER_CENTER_CLIENT_SECRET }}
    - run: msstore apps list
```

## Azure DevOps Example

```yaml
name: Publish Windows App to Microsoft Store
trigger:
- main
pool:
  vmImage: 'windows-latest'
steps:
- checkout: self
- task: UseMSStoreCLI@0
- script: msstore reconfigure --tenantId $(PARTNER_CENTER_TENANT_ID) --sellerId $(PARTNER_CENTER_SELLER_ID) --clientId $(PARTNER_CENTER_CLIENT_ID) --clientSecret $(PARTNER_CENTER_CLIENT_SECRET)
- script: msstore apps publish --package-path $(Build.ArtifactStagingDirectory)/MyWindowsApp.msix
```

## Supported Windows App Types

| Package Type | Description | File Extension |
|--------------|-------------|----------------|
| **MSIX** | Modern Windows app packages | `.msix` |
| **AppX** | Universal Windows Platform (UWP) apps | `.appx` |
| **Desktop Bridge** | Win32 apps packaged for the Store | `.msix`, `.appx` |
| **Progressive Web Apps** | Web apps packaged for Windows | `.msix` |

## Complete Publishing Workflow

```yaml
name: Complete Windows App Publishing Pipeline
on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-publish:
    runs-on: windows-latest
    steps:
    # Build your Windows app
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '6.0.x'
    
    - name: Build Windows App
      run: dotnet publish -c Release -r win-x64 --self-contained
    
    - name: Create MSIX Package
      run: # Your MSIX packaging commands here
    
    # Publish to Microsoft Store
    - name: Setup MSStore CLI
      uses: microsoft/setup-msstore-cli@v1.1
    
    - name: Configure Store CLI
      run: msstore reconfigure --tenantId ${{ secrets.PARTNER_CENTER_TENANT_ID }} --sellerId ${{ secrets.PARTNER_CENTER_SELLER_ID }} --clientId ${{ secrets.PARTNER_CENTER_CLIENT_ID }} --clientSecret ${{ secrets.PARTNER_CENTER_CLIENT_SECRET }}
    
    - name: Publish to Microsoft Store
      run: msstore apps publish --app-id ${{ secrets.APP_ID }} --package-path ./output/MyApp.msix
    
    - name: Monitor Publishing Status
      run: msstore apps status --app-id ${{ secrets.APP_ID }}
```

## Required Secrets Configuration

Add these secrets to your GitHub repository or Azure DevOps pipeline:

| Secret Name | Description |
|-------------|-------------|
| `PARTNER_CENTER_TENANT_ID` | Your Azure AD tenant ID |
| `PARTNER_CENTER_SELLER_ID` | Your Partner Center seller ID |
| `PARTNER_CENTER_CLIENT_ID` | Your Azure AD app client ID |
| `PARTNER_CENTER_CLIENT_SECRET` | Your Azure AD app client secret |
| `APP_ID` | Your Microsoft Store app ID |

## Features Overview

### 🔧 Setup & Configuration
- **MSStore CLI Installation** - Automatically installs and configures the Microsoft Store Developer CLI
- **Authentication** - Secure OAuth2 integration with Partner Center
- **Cross-platform** - Works on Windows runners/agents

### 📦 App Publishing
- **Package Upload** - Upload MSIX, AppX, and other Windows app packages
- **Metadata Management** - Update app descriptions, release notes, and store listings
- **Asset Management** - Upload screenshots, logos, and other store assets
- **Version Control** - Manage app versions and roll out updates

### 📊 Monitoring & Status
- **Real-time Status** - Track submission progress and publishing status
- **Error Handling** - Detailed error reporting and troubleshooting
- **Logging** - Comprehensive logs for debugging and audit purposes

## Getting Started

1. **Setup Partner Center**: Create an Azure AD app registration and configure Partner Center API access
2. **Configure Secrets**: Add your Partner Center credentials as repository secrets
3. **Add to Workflow**: Include this action in your GitHub Actions or Azure DevOps pipeline
4. **Build & Publish**: Build your Windows app and publish to the Microsoft Store

## Documentation

- [Microsoft Store Developer CLI Documentation](https://github.com/microsoft/msstore-cli)
- [Partner Center API Reference](https://docs.microsoft.com/en-us/windows/uwp/monetize/create-and-manage-submissions-using-windows-store-services)
- [MSIX Packaging Documentation](https://docs.microsoft.com/en-us/windows/msix/)

## Support

For issues and questions:
- [GitHub Issues](https://github.com/microsoft/setup-msstore-cli/issues)
- [Microsoft Store Developer Support](https://developer.microsoft.com/en-us/microsoft-store/support/)

---

**Publish Windows App to Microsoft Store** - Streamline your Windows app publishing with automated CI/CD workflows.
