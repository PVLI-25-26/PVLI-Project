The logger must be used when **sending messages to the console** for any use case.
The use of the logger is important to **maintain clean and organized console messages** while developing. Without it, thousands of messages could be logging to the console, making it impossible to debug or read important information.

The logger can be access as a global plugin in the Plugin Manager. To get a reference to the logger, use:
``` javascript
// <this> is a scene
this.plugins.get('logger');
```

## How to setup
**Each developer must have their own logger configuration**, the file is ignored in the `.gitignore`. This file must be found in: `src/configs/logger-config.json`. This JSON has two properties: `modules` and `level`.
The `modules` property is an array of `Strings`, each `String` being the active modules of the logger.
The `level` property is a `Number` between `[0 - 3]` which refers to the active log level. Look at [[#Log levels]].

Example of `src/configs/logger-config.json`:
``` JSON
{
    "modules": ["NOTHING"],
    "level": 0
}
```

## How to use
The logger has only one method:
``` javascript
log( moduleKey, logLevel, message )
```
`String`:`moduleKey` -- Specifies the module where the message belongs.
`LOG_LEVELS`:`logLevel` -- Specifies the level of the message being sent.
`String`:`message` -- The message being logged.

Only messages with the same `moduleKey` as one of the enabled modules will be logged.
Also, only messages with the higher or equal log level than the current [[#Log levels]] will be logged.

To specify the different possible log levels, you must import `LOG_LEVELS` from `src/js/core/logger.js`. The `LOG_LEVELS` object is used as an enum to avoid incorrectly typing the level. You may also use the values from 0 to 3.

## Log levels
Log levels are used to filter log messages by importance. There are 5 levels of importance:
```
DEBUG (0) < INFO (1) < WARNING (2) < ERROR (3)
```

## Example
``` Javascript
// let logger = [Get logger from plugin manager]
logger.log('HUB', LOG_LEVELS.INFO, 'Equipment bought succesfully.');
```
Output
```
13:13:54 [HUB] [INFO]: Equipment bought succesfully.
```
