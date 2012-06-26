/**
 *  date command
 *
 *  Usage: 
 *    date                            // 2012-01-31 13:37:00
 *    date %H:%M:%S %m-%d-%Y          // 13:37:00 01-31-2012
 *    date unix                       // 1340735625334
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
        defaultValue: '%Y-%m-%d %H:%M:%S'
      }
    ],
    exec: function(args, context) {
      let format = args.format.join ? args.format.join(' ') : args.format;
      return format === 'unix' ? Date.now() : new Date().toLocaleFormat(format);
    }
  }
);