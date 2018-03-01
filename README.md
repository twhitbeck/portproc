# PortProc

A utility to:
- get the ID of the process currently using a given port
- get the port currently in use by a given process ID

## Installation

```sh
$ npm install --save portproc
```

or

```sh
$ yarn add portproc
```

## Usage

```javascript
const { portToProc, procToPort } = require("portproc");

const pid = portToProc(3000);  // The PID of the process using port 3000
const port = procToPort(54321);  // The port that process '54321' is currently using
```

## Contributing

This project uses a basic eslint rule set; please follow it.
