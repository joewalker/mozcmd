
gcli.addCommand({
  name: 'qsa',
  description: 'perform querySelectorAll on the current document and return number of matches',
  params: [
    {
      name: 'query',
      type: 'string',
      description: 'CSS selectors seperated by comma',
    }
  ],
  exec: function(args, context) {
    var result = context.environment.contentDocument.querySelectorAll(args.query);
    return result.length;
  }
});
