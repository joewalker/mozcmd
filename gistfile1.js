/**
* date command
*
* Usage:
* date // Tue 31 Jan 2012 13:37:00 PM CET
* date %H:%M:%S %m-%d-%Y // 13:37:00 01-31-2012
* date stamp // 1340735625334
*/
gcli.addCommand(
  {
    name: 'date',
    description: 'Prints the date to the command line',
    params: [
      {
        name: 'format',
        type: { name: 'array', subtype: 'string' },
        description: 'The format of the date',
        defaultValue: '%c'
      }
    ],
    exec: function(args, context) {
      let format = args.format.join ? args.format.join(' ') : args.format;
      return format === 'stamp' ? Date.now() : new Date().toLocaleFormat(format);
    }
  }
);