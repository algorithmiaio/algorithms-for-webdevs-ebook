# Appendix A: Setting Up A Development Environment
This section explains how to set up a development environment to utilize the Algorithmia API using Node.js. Whether you are using the API in a larger project, or simply working through the examples in this book, the setup process is the same.

## The Algorithmia NPM Package
Algorithmia provides seamless access to all algorithms in the API library. If you are familiar with Node.js, using the Algorithmia package is effortless. If you are less familiar with Node.js, read on to the next section to continue the setup process.

You can find the package documentation on the official [npm page](https://www.npmjs.com/package/algorithmia).

Simply run `npm install --save algorithmia` in your terminal from the project root folder.

Alternatively, you can add the package dependency in your package.json file:

```
{
    "dependencies": {
        "algorithmia": "^0.2.1"
    }
}
```

Then run `npm install` from your project root folder.

The package contains a folder called `examples` where you will find more demonstrations.

## Configure Algothmia API Key
To utilize the Algorithmia API, you will need to set up an account and configure your environment to use your API key.

Visit [Algorithmia.com](https://algorithmia.com) to set up a new account. Your API key is
available on your account credentials page. Find it by navigating to your user dashboard or by replacing "your-username" in the url below with the username you chose:

https://algorithmia.com/users/your-username#credentials

The scripts used in this book use an environment variable to access the API key. Once you know your API key, there are two ways to use it in your scripts. The first way is to simply pass the API key as an argument when you invoke the Node.js script.

```
ALGORITHMIA_API_KEY=your-key node your-script.js
```

In Unix systems, you may define `ALGORITHMIA_API_KEY` as an environment variable. This means you don't have to pass it to the scripts every time.

Place this at the bottom of `.bashrc`, usually located at `~/.bashrc`:

```
# Algorithmia API Key
export ALGORITHMIA_API_KEY=your-key
```

Now, when you invoke the Node.js scripts, they will be able to access `process.env.ALGORITHMIA_API_KEY` on their own. Simply run the script:
```
node your-script.js
```
## Verify it Works

Run any of the example scripts in this [book's repository](https://github.com/algorithmiaio/algorithms-for-webdevs-ebook) to verify your environment is set up correctly. You can also find more support through the [official documentation](https://algorithmia.com/docs/).
