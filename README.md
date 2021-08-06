# Ableton Max for Live - Typescript Project

## Getting started

- Clone this repo
- Run `npm install` to install dependencies
- Run `npm run build` to build the project
- Run `npm run watch` to continuously build the project on further changes

## Installing the device into Ableton

Open this project with your computer's folder browser. Drag `max-device.amxd` into Ableton's window, onto a MIDI effect chain:

<img width="400px" src="https://user-images.githubusercontent.com/6913320/128578695-f1c5ada0-ad7e-41f5-bc9b-9846e3de2ae4.png"/>

Open the device by clicking the top left icon here:

<img width="400px" src="https://user-images.githubusercontent.com/6913320/128578723-00ce8520-065a-4337-9ba8-efcfa3d9d052.png"/>

Open the Max Console by clicking the button highlighted blue in this picture:

<img width="600px" src="https://user-images.githubusercontent.com/6913320/128578748-aef5b66c-8366-4d97-aa97-1c9a586315ce.png"/>

## Making changes

After running `npm run watch`, Ableton will re-run your script every time you change something in your Typescript code.

[src/max-index.tsx](src/max-index.tsx) is the entry point used for Ableton, while [src/node-index.tsx](src/node-index.tsx) is an alternate entry point to run node from your command line. This is useful when testing things that doesn't rely on Ableton. Run the node program outside of Ableton by running `node dist/node-index.js`.

Edit [src/app/master.ts](src/app/master.ts) to change the functionality of the device. You can log to the console using `this.logger.log()`. Anything you log should show in the Max Console, or the command line console if you are running the script yourself as `node-index.js`.
