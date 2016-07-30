var webpack = require("webpack");
var Server = require("webpack-dev-server");

const detectPort = require("detect-port");
import {QuickPackOptions} from "./options";

export default function startDevServer(config: any, options: QuickPackOptions) {
  const port = options.devServerPort;

  const compiler = webpack(config);

  const serverOptions: any = {
    contentBase: options.projectRoot,
    publicPath: config.output.publicPath,
    // hot: true,
    stats: "normal",
    // quiet: true,
  }

  const {forwardServer} = options;
  if (forwardServer !== undefined) {
    let backendHost: string;

    // Try parsing as port
    try {
      const port = JSON.parse(forwardServer);
      backendHost = `http://127.0.0.1:${port}`;
    } catch (err) {
      backendHost = forwardServer;
      // console.log(err);
    }

    if (!backendHost.match(/^https?:\/\//i)) {
      backendHost += "http://"
    }

    // TODO massage URL
    console.log("Proxy to backend:", backendHost);
    serverOptions.proxy = {
      '/*': {
        target: backendHost,
        secure: false,
      },
    }
  }

  console.log("Server starting on:", port);

  new Server(compiler, serverOptions).listen(port, (err: any) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
