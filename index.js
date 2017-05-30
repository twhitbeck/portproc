const cp = require("child_process");
const { flow } = require("lodash/util");
const { endsWith, startsWith } = require("lodash/string");

// split a string up by line breaks
const splitLines = string => string.split("\n");
// split a string up by space breaks
const splitBySpace = string => string.match(/\S+/g) || [];
// map over array of strings and splitBySpace
const formColumns = data => data.map(splitBySpace);
// does some string start with 'tcp'
const startsWithTcp = string => startsWith(string, "tcp");
// does some string start with 'udp'
const startsWithUdp = string => startsWith(string, "udp");
// does some string start with 'tcp' or 'udp'
const startsWithProtocol = string => startsWithTcp(string) || startsWithUdp(string);
// lower the case of some string
const toLowerCase = string => string.toLowerCase();
// is string representative of a packet?
const isPacket = flow([toLowerCase, startsWithProtocol]);
// remove any string from array of string that is not isPacket
const stripHeaders = strings => strings.filter(isPacket);
// does some string end with a port notation
const hasPort = (string, port) => endsWith(string, `:${port}`) || endsWith(string, `.${port}`);
// convert stdout from netstat into easy to use columns in 3D Array
const parseData = flow([splitLines, stripHeaders, formColumns]);
// split string on period or colon
const splitPeriodOrColon = string => string.split(/[:.]+/);
// get the last item in Array
const lastItem = array => array[array.length - 1];
// parse a port from a netstat address column
const parsePort = flow([splitPeriodOrColon, lastItem]);
// does some string contain a given proc id
const hasProc = (string, proc) => string === proc.toString() || startsWith(string, `${proc}/`);

const platforms = {
    darwin: {
        cmd: "netstat -anv -p TCP && netstat -anv -p UDP",
        columns: {
            port: 3,
            proc: 8
        }
    },
    linux: {
        cmd: "netstat -tunlp",
        columns: {
            port: 3,
            proc: 6
        }
    },
    win32: {
        cmd: "netstat -ano",
        columns: {
            port: 1,
            proc: 4
        }
    }
};

const config = platforms[process.platform];

const netstat = new Promise((resolve, reject) => {
    cp.exec(config.cmd, (err, stdout) => {
        if (err) {
            reject(err);
            return;
        }
        const data = parseData(stdout);
        resolve(data);
    });
});

const portToProc = port => netstat.then(data => {
    const hit = data.find(packet => hasPort(packet[config.columns.port], port));
    const proc = hit ? parseInt(hit[config.columns.proc], 0) : undefined;
    return proc;
});

const procToPort = proc => netstat.then(data => {
    const hit = data.find(packet => hasProc(packet[config.columns.proc], proc));
    const port = hit ? parsePort(hit[config.columns.port]) : undefined;
    return port;
});

module.exports = { portToProc: portToProc, procToPort: procToPort };
