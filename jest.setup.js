// We're redefining the console here so that we can do some fixing of warning messages that
// piss me off. The console.warn from React-Native's webview having been extracted would show
// every time you ran a single test.
// define a new console
var console = (function(origConsole) {
  return {
    log: function(...text) {
      origConsole.log.apply(origConsole, text);
    },
    info: function(...text) {
      origConsole.info.apply(origConsole, text);
    },
    warn: function(...text) {
      if (
        text.length > 0 &&
        text[0].includes('WebView has been extracted from react-native core')
      ) {
        return;
      }
      origConsole.warn.apply(origConsole, text);
    },
    error: function(...text) {
      origConsole.error.apply(origConsole, text);
    },
    trace: function(...text) {
      origConsole.trace.apply(origConsole, text);
    },
  };
})(global.console);

// Then redefine the old console
global.console = console;
