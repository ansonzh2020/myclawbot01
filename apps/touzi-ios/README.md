# Touzi iOS (v1.0)

This repo is scaffolded on Linux, so it includes an **XcodeGen** spec rather than a generated `.xcodeproj`.

## Requirements
- macOS + Xcode
- XcodeGen: https://github.com/yonaskolb/XcodeGen

## Generate the project
```bash
cd apps/touzi-ios
xcodegen generate
open Touzi.xcodeproj
```

## Targets
- Touzi (SwiftUI app)
- TouziTests (unit tests)

## iOS deployment target
- iOS 16+ (chosen to cover popular installed base). Uses Core Data (not SwiftData).
