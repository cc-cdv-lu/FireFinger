# FireFinger

Check the pdf to get a more in-depth overview.

## Instructions

- Login (no password needed)
- Select chapter
- Adjust settings
- Play

Custom dictations can be put into **%appdata%/FireFinger/docs**/_subfolder/example.txt_ as simple txt-files.

### Shortcuts

- **Pause**: Skip this char
- **Ctrl + UP** _OR_ **Ctrl + (+)** : Zoom-in
- **Ctrl + DOWN** _OR_ **Ctrl + (-)** : Zoom-out
- **Ctrl + Shift + X**: Jump to input
- **Down** : Repeat this letter
- **Right**: Repeat this word
- **Esc** Close FireFinger
- Accesskeys (https://www.w3schools.com/tags/att_global_accesskey.asp)
  - **H**: Home
  - **S**: Settings
  - **C**: Chapters
  - **U**: User

## Changelog

All notable changes to this project will be documented in this file.

### [Future plans]

- TBA

### [1.1.1] Minor patch
- Fixes
    - Fixed some accessibility issues
    - Changed focus input shortcut because of clash with JAWS
        - Before: Ctrl + Shift + X
        - Now: Ctrl + Alt + X

### [1.1.0] First major update

- Features
  - Integrated courses and custom courses are now separated. You'll find your own texts in "My texts"
  - Added font selector
  - Many improvements for people using braille displays
  - Added new and improved german course
  - Guideline can now be turned off
- Other
  - Upgrade to newest angular-electron and Angular 8
  - Fixes white background on bottom of pages
  - Many more fixes, ugliness cleanup and much more

### [1.0.5] More accessibility features

- Features:
  - New colors schemes to support edge filter glasses (Kantenfilterbrillen)
  - Added accesskey support
  - Saving previous session - can continue where left off

### [1.0.4] Visual changes

- Features
  - Improved about section
  - New logo
  - Improved chapter view descriptions

### [1.0.3] Usability and user experience improvements

- Features:
  - Victory and failure sounds can now be toggled off in the settings
  - Settings page now displays a link to the FireFinger wiki page
  - Ctrl + Shift + X now focusses the 'typing' area
  - Improve accessibility when launching FireFinger
    - Input field will now automatically be focussed upon loading the main view (opening FireFinger, or switching from settings back to main view). This creates a box around the currently highlighted letter. This box can be toggled on/off in the settings. Default is hidden
    - Read out loud the currently displayed letter when launching FireFinger

### [1.0.2] Accessibility, difficulty settings and minor improvements

- Features:
  - Difficulty can now be modified in the settings tab
  - Improved end of chapter screen
  - Improved accessiblity by implementing support for braille displays and keyboard navigation. Feature is not fully finished yet
- Fixes:
  - Upon first login the user will now be prompted for their login before the level selection appears
  - Many parts of the code have been refactored and/or cleaned up
  - [MacOS] Fixed bug that prevented courses from being imported upon first install

### [1.0.1] MacOS app registered

- Features:
  - [MacOS] Registered the app with Apple to prevent security warnings upon install

### [1.0.0] First major release

- Features:
  - Added Ctrl+Up/Down for zooming (useful for laptops)
  - Added reload chapters button to the chapter selection screen
  - The username will now be displayed on the login button, if someone is logged in
  - New icon featuring CDV logo
  - A predefined set of chapters will now be copied to the userdata folder upon first launch
  - The end of a text is now marked with a checkmark ✓
  - Added support for MacOS
  - Repolished the whole layout
  - Added info/contact box to settings
- Fixes:
  - Increased upper and lower zoom bounds
  - Fixed issue where footer and header would get distorted at very high/low zooms
  - Fixed certain special characters not being recognized (e.g. €, &, %, ...)
  - Fixed issues that occured with lower resolution screens (e.g. laptops)
  - Fixed settings screen text and buttons (also removed sliders)
  - Fixed display content scrolling up and down in the fixed view
  - Fixed missing localization
  - Fixed white screen on first launch
  - Many more minor improvements and fixes...

### [0.7.0] Alpha release

- Most vital features are present in this release
- Fixes:
  - Improved accuracy of stats calculation
  - Slightly improved end of level screen - still needs some work
  - Fixed first letter of setence and words dissappearing from prev section

### [<0.7.0] Prototyping

- ...

## Technical

Uses node.js 10.3.0 and npm 6.xxx

## Legal disclaimer

...
