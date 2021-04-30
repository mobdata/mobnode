# Mobnode Server

The API for the Mobnode application.

## Usage

Simply install the project dependencies with `yarn` or `npm`.

```shell
$ yarn install
... or
$ npm install
```

### Development

To develop for the Mobnode API, there are some configurations that have to be made in the `.env` file.

To get started quickly, copy the `.env.example` file committed to the repository.

```shell
$ cp .env.example .env
```

The API server strictly enforces SSL usage; therefore, we must supply a path to a valid certificate, key, and certificate authority. An example for how we develop interally is as follows.

```
SSL_KEY_PATH="/path/to/private/key.pem"
SSL_CERT_PATH="/path/to/certs/cert.pem"
SSL_CA_PATH="/path/to/ca-chain.cert.pem"
```

In addition to SSL configuration, it is also important to provide the host the API is running on, the main CouchDB user, and the secret that the CouchDB uses to successfully implement [proxy authentication]((http://docs.couchdb.org/en/2.1.1/api/server/authn.html#proxy-authentication)).

After all the configuration is done, simply run the server using `yarn` or `npm`.

## API

This is the documentation for each of the endpoints on the Mobnode API.

**Note:** All `POST`, `PUT`, and `DELETE` requests only accept a `Content-Type` of `application/json`. This is for simplicity and security.

`/api/nodes` - The endpoint for maintaining the nodes (remote Mobnodes) in a given network.

* `GET` - Retrieves all the nodes in a network
* `POST` - Creates a new node given the proper JSON structure. The following fields are required.
	* `node_name` - A simple name for the node
	* `host` - The host name at which the remote Mobnode resides
	* `port` - The port at which the application is accessible
	* `username` - (_Temporary_) Used for remote authentication
	* `password` - (_Temporary_) Used for remote authentication
* `PUT` - Batch updates nodes through CouchDB's [bulk docs](http://docs.couchdb.org/en/2.1.1/api/database/bulk-api.html#db-bulk-docs) API. Instead of passing a JSON array with a key value of `"docs"`, simply pass the array of nodes (following the specified JSON format in the `POST` request) with a key value of `"nodes"`. Below is a visualization.

```json
{
	"nodes": [
		{
			node_name: "mynode",
			...
		}
	]
}
```

* `DELETE` - Uses the bulk docs API references above to delete docs in bulk. Follow the same convention as `PUT`, except use `DELETE`.