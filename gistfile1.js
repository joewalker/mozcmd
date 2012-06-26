/*
 *  loadscript command
 */
gcli.addCommand({
  name: 'loadscript',
  description: 'Loads a JavaScript resource into the current page',
  params: [
    {
      name: 'file',
      type: 'string',
      description: 'Path to script to load'
    }
  ],
  exec: function(args, context) {
    let script = context.environment.contentDocument.createElement('script');
    script.src = args.file;
    context.environment.contentDocument.body.appendChild(script);
  }
});