# PortProc

A utility to:
- get the ID of the process currently using a given port
- get the port currently in use by a given process ID

## Installation

For use as a command line tool:

```
npm install --global portproc
```

For use as a library:

```
npm install --save portproc
```

## Command Line Usage

To find out what port a process is using you just supply the process id:

```
portproc 54321
```

And to find out what process is using a given port, prefix the port with a colon:

```
portproc :3000
```

## Library Usage

```javascript
const { portToProc, procToPort } = require("portproc");

const pid = portToProc(3000);  // The PID of the process using port 3000
const port = procToPort(54321);  // The port that process '54321' is currently using
```

## Contributing

This project uses a basic eslint rule set; please follow it.
