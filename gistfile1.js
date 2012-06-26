/**
 *  date command
 */
gcli.addCommand(
  {
    name: 'date',
    description: 'Prints the date to the command line',
    params: [
      {
        name: 'format',
        type: 'string',
        description: 'The format of the date',
        defaultValue: '%Y-%m-%d %H:%M:%S'
      }
    ],
    exec: function(args, context) {
      return new Date().toLocaleFormat(args.format);
    }
  }
);