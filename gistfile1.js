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
      },
      {
        name: 'date',
        type: 'string',
        description: 'Format this time',
        defaultValue: ''
      }
    ],
    exec: function(args, context) {
      var date;

      if (args.date)
        date = new Date(args.date);
      else
        date = new Date();

      return date.toLocaleFormat(args.format);
    }
  }
);