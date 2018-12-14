# FireFinger

**wip** this needs a big update...

## Instructions


* Select chapter
* Login
* Adjust settings
* Play

Custom dictations can be put into **%appdata%/FireFinger/docs** */subfolder/example.txt*  

### First time use

* Open FireFinger
* Go to chapters
* Click the folder icon
* Copy the premade courses to that folder
* Back in FireFinger reload using the reload button
* Login
* Done


### Shortcuts

* **Insert**: Skip this char  
* **Ctrl + UP**  *OR*  **Ctrl + (+)** : Zoom-in  
* **Ctrl + DOWN**   *OR*  **Ctrl + (+)** : Zoom-out  
* **Down** : Repeat this letter  
* **Right**: Repeat this word  


## Changelog
All notable changes to this project will be documented in this file.

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
-  Fixes:
    - Improved accuracy of stats calculation
    - Slightly improved end of level screen - still needs some work
    - Fixed first letter of setence and words dissappearing from prev section

### [<0.7.0] Testing

## Technical
Uses node.js 10.3.0 and npm 6.xxx

## Introduction

## Mockups
![FireFinger architecture concept](Concept art/New Mockup 4.png)

![FireFinger architecture concept](Concept art/Views.png)
![FireFinger architecture concept](Concept art/Highlighting.png)

![FireFinger architecture concept](Concept art/Inverted mode.png)

## Architecture
![FireFinger architecture concept](concept.png)

## Usage

## Legal disclaimer
