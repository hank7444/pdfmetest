# eforms-ui-pdflib change log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Dates in this CHANGELOG follow the [ISO 8601 date format](https://www.w3.org/QA/Tips/iso-date).

<!-- Example

## [Unreleased]

## [1.0.29] - 2022-03-01
### Updated
- [SDE-348](https://projects.cdk.com/browse/SDE-348) Changed athena-libs to v.0.29 to use corrected react-internal build-templates path 

### Fixed
- Updated changelog format to v1.1.0.

-->

## [5.2.16.1] - 2025-04-16
### Updated
- [EFORM-9255](https://projects.cdk.com/browse/EFORM-9255) – Move POC pdfme packages (common & ui) to CDK GitHub repo
- Add new type: EditWidgetInfo
- Add new props to Designer: isEditWidgetGroupMode and isWidgetDesigner
- Add new public callbacks to Desginer: onChangePageCursor and onChangePageSizes
- Add new public methods to Designer: setPageCursor and setIsEditWidgetGroupMode
- Hide plugin toolbar when isEditWidgetGroupMode is true
- Hide the "Bulk update field names" button in the right sidebar list view when isEditWidgetGroupMode is true
- Disable copy, paste, and delete schema via hotkeys when isEditWidgetGroupMode is true
- Hide the "Add Page" button and "Remove Page" button when isWidgetDesigner is true
- Use EditWidgetInfo.padding when isWidgetDesigner is true — this allows both the padding and the base PDF to be displayed on the canvas simultaneously