
<br /><br />

<div align="center">
  <h1 align="center">@substrate/api-sidecar</h1>
  <h4 align="center"> REST service that makes it easy to interact with blockchain nodes built using Substrate's
    <a href="https://substrate.dev/docs/en/knowledgebase/runtime/frame">FRAME</a>
    framework.</h4>
  <p align="center">
    <a href="https://www.npmjs.com/package/@substrate/api-sidecar">
      <img alt="npm" src="https://img.shields.io/npm/v/@substrate/api-sidecar" />
    </a>
    <a href="https://github.com/paritytech/substrate-api-sidecar/actions">
      <img alt="Github Actions" src="https://github.com/paritytech/substrate-api-sidecar/workflows/pr/badge.svg" />
    </a>
    <a href="https://github.com/paritytech/substrate-api-sidecar/blob/master/LICENSE">
      <img alt="GPL-3.0-or-later" src="https://img.shields.io/npm/l/@substrate/api-sidecar" />
    </a>
  </p>
</div>

<br /><br />

## NOTICE

For the Asset hub migration please refer to the guide in [guides/ASSET_HUB_MIGRATION.md](guides/ASSET_HUB_MIGRATION.md)

### Asset Hub Migration + Elastic Scaling

**Important**: For all version >= 20.4.0, all endpoints that support the `useRcBlock` parameter return array responses instead of single enhanced objects when it is used. This prepares the API for Polkadot/Kusama elastic scaling.

- **With `useRcBlock=true`**: Returns `[{...result, rcBlockNumber, ahTimestamp}]` or `[]`  
- **Without this parameter**: Returns single response object (unchanged)

For detailed migration guide, see [guides/ASSET_HUB_MIGRATION.md](guides/ASSET_HUB_MIGRATION.md)

## Prerequisites

### <= v15.0.0
This service requires Node versions 14 or higher.

Compatibility:
| Node Version  | Stablility  |
|---------------|:-----------:|
|     v14.x.x   |   Stable    |
|     v16.x.x   |   Stable    |
|     v17.x.x   |   Stable    |
|     v18.x.x   |   Stable    |
|     v19.x.x   |   stable    |

### >= v16.0.0
This service requires Node versions 18.14 or higher.

Compatibility:
| Node Version  | Stablility  |
|---------------|:-----------:|
|     v18.14.x  |   Stable    |
|     v20.x.x   |   Stable    |
|     v21.x.x   |   Pending   |

NOTE: Node LTS (`long term support`) versions start with an even number, and odd number versions are subject to a 6 month testing period with active support before they are unsupported. It is recommended to use sidecar with a stable actively maintained version of node.js.

## Table of contents

- [NPM package installation and usage](#npm-package-installation-and-usage)
- [Source code installation and usage](#source-code-installation-and-usage)
- [Configuration](#configuration)
- [Debugging fee and staking payout calculations](#debugging-staking-payout-calculations)
- [Available endpoints](https://paritytech.github.io/substrate-api-sidecar/dist/)
- [Chain integration guide](./guides/CHAIN_INTEGRATION.md)
- [Docker](#docker)
- [Notes for maintainers](#notes-for-maintainers)
- [Hardware requirements](#hardware-requirements)

## NPM package installation and usage

### Global installation

Install the service globally:

```bash
npm install -g @substrate/api-sidecar
# OR
yarn global add @substrate/api-sidecar
```

Run the service from any directory on your machine:

```bash
substrate-api-sidecar
```

To check your version you may append the `--version` flag to `substrate-api-sidecar`.

### Local installation

Install the service locally:

```bash
npm install @substrate/api-sidecar
# OR
yarn add @substrate/api-sidecar
```

Run the service from within the local directory:

```bash
node_modules/.bin/substrate-api-sidecar
```

### Finishing up

[Jump to the configuration section](#configuration) for more details on connecting to a node.

[Click here for full endpoint docs.](https://paritytech.github.io/substrate-api-sidecar/dist/)

In the full endpoints doc, you will also find the following `trace` related endpoints :
- `/experimental/blocks/{blockId}/traces/operations?actions=false`
- `/experimental/blocks/head/traces/operations?actions=false`
- `/experimental/blocks/{blockId}/traces`
- `/experimental/blocks/head/traces`

To have access to these endpoints you need to :
1. Run your node with the flag `—unsafe-rpc-external`
2. Check in sidecar if `BlocksTrace` controller is active for the chain you are running.

Currently `BlocksTrace` controller is active in [Polkadot](https://github.com/paritytech/substrate-api-sidecar/blob/ff0cef5eaeeef74f9a931a0355d83fc5ebdea645/src/chains-config/polkadotControllers.ts#L17) and [Kusama](https://github.com/paritytech/substrate-api-sidecar/blob/ff0cef5eaeeef74f9a931a0355d83fc5ebdea645/src/chains-config/kusamaControllers.ts#L17).

## Source code installation and usage

### Quick install

Simply run `yarn`.

### Rust development installation

If you are looking to hack on the `calc` Rust crate make sure your machine has an [up-to-date version of `rustup`](https://www.rust-lang.org/tools/install)
installed to manage Rust dependencies.

Install `wasm-pack` if your machine does not already have it:

```bash
cargo install wasm-pack
```

Use yarn to do the remaining setup:

```bash
yarn
```

### Running

```bash
# For live reload in development
yarn dev

# To build and run
yarn build
yarn start
```

[Jump to the configuration section](#configuration) for more details on connecting to a node.

## Configuration

To use a specific env profile (here for instance a profile called 'env.sample'):

```bash
NODE_ENV=sample yarn start
```

For more information on our configuration manager visit its readme [here](https://gitlab.com/chevdor/confmgr/-/raw/master/README.adoc). See `Specs.ts` to view the env configuration spec.

### Express server

- `SAS_EXPRESS_BIND_HOST`: address on which the server will be listening, defaults to `127.0.0.1`.
- `SAS_EXPRESS_PORT`: port on which the server will be listening, defaults to `8080`.
- `SAS_EXPRESS_KEEP_ALIVE_TIMEOUT`: Set the `keepAliveTimeout` in express.
- `SAS_EXPRESS_MAX_BODY`: Set the size of request body payload, defaults to `100kb`
- `SAS_EXPRESS_INJECTED_CONTROLLERS`: When set (_e.g. SAS_EXPRESS_INJECTED_CONTROLLERS=true_), automatically detects the available pallets in the chain's metadata and injects the appropriate controllers. If set to `false`, it uses the controllers defined in the chains configuration files. Defaults to `false` when the flag is not defined. Note: This flag does not replace completely the need of the chains-config files since we are still retrieving the options from that file. 

### Substrate node

- `SAS_SUBSTRATE_URL`: URL to which the RPC proxy will attempt to connect to, defaults to
    `ws://127.0.0.1:9944`. Accepts both a websocket, and http URL.
- `SAS_SUBSTRATE_MULTI_CHAIN_URL`: JSON array of chain configurations, each containing a `url` and `type` property. The `type` can be 'relay', 'assethub', 'parachain', or undefined. Currently used for Asset Hub migration to query staking information and additional session/babe information from the relay chain. In future releases, this will also be used to improve performance by allowing Sidecar to retrieve information from multiple nodes. This environment variable should be used in combination with the `SAS_SUBSTRATE_URL` variable. Example:
    ```bash
    SAS_SUBSTRATE_URL=wss://westend-asset-hub-rpc.polkadot.io
    SAS_SUBSTRATE_MULTI_CHAIN_URL='[{"url":"wss://westend-rpc.polkadot.io","type":"relay"}]'
    ```

### Metrics Server

- `SAS_METRICS_ENABLED`: Boolean to enable the metrics server instance with Prometheus (server metrics) and Loki (logging) connections. Defaults to false.
- `SAS_METRICS_PROM_HOST`: The host of the prometheus server used to listen to metrics emitted, defaults to `127.0.0.1`.
- `SAS_METRICS_PROM_PORT`: The port of the prometheus server, defaults to `9100`.
- `SAS_METRICS_LOKI_HOST`: The host of the loki server used to pull the logs, defaults to `127.0.0.1`.
- `SAS_METRICS_LOKI_PORT`: The port of the loki server, defaults to `3100`

#### Custom substrate types

Some chains require custom type definitions in order for Sidecar to know how to decode the data
retrieved from the node. Sidecar affords environment variables which allow the user to specify an absolute path to a JSON file that contains type definitions in the corresponding formats. Consult polkadot-js/api for more info on
the type formats (see `RegisteredTypes`). There is a helper CLI tool called [generate-type-bundle](https://github.com/paritytech/generate-type-bundle) that can generate a `typesBundle.json` file for you using chain information from [`@polkadot/apps-config`](https://github.com/polkadot-js/apps/tree/master/packages/apps-config). The generated json file from this tool will work directly with the `SAS_SUBSTRATE_TYPES_BUNDLE` ENV variable. 

- `SAS_SUBSTRATE_TYPES_BUNDLE`: a bundle of types with versioning info, type aliases, derives, and
    rpc definitions. Format: `OverrideBundleType` (see [`typesBundle`](https://github.com/polkadot-js/api/blob/21039dec1fcad36061a96bf5526248c5fab38780/packages/types/src/types/registry.ts#L72)).
- `SAS_SUBSTRATE_TYPES_CHAIN`: type definitions keyed by `chainName`. Format: `Record<string, RegistryTypes>` (see [`typesChain`](https://github.com/polkadot-js/api/blob/21039dec1fcad36061a96bf5526248c5fab38780/packages/types/src/types/registry.ts#L76)).
- `SAS_SUBSTRATE_TYPES_SPEC`: type definitions keyed by `specName`. Format: `Record<string, RegistryTypes>` (see [`typesSpec`](https://github.com/polkadot-js/api/blob/21039dec1fcad36061a96bf5526248c5fab38780/packages/types/src/types/registry.ts#L80)).
- `SAS_SUBSTRATE_TYPES`: type definitions and overrides, not keyed. Format: `RegistryTypes` (see [`types`](https://github.com/polkadot-js/api/blob/21039dec1fcad36061a96bf5526248c5fab38780/packages/types/src/types/registry.ts#L64)).

You can read more about [defining types for polkadot-js here.](https://polkadot.js.org/api/start/types.extend.html)

##### Connecting a modified node template

Polkadot-js can recognize the standard node template and inject the correct types, but if you have
modified the name of your chain in the node template you will need to add the types manually in a
JSON `types` file like so:

```json
// my-chains-types.json
{
  "Address": "AccountId",
  "LookupSource": "AccountId"
}
```

and then set the enviroment variable to point to your definitions:

```bash
export SAS_SUBSTRATE_TYPES=/path/to/my-chains-types.json
```

### Logging

- `SAS_LOG_LEVEL`: The lowest priority log level to surface, defaults to `info`. Tip: set to `http`
    to see all HTTP requests.
- `SAS_LOG_JSON`:Whether or not to have logs formatted as JSON, defaults to `false`.
    Useful when using `stdout` to programmatically process Sidecar log data.
- `SAS_LOG_FILTER_RPC`: Whether or not to filter polkadot-js API-WS RPC logging, defaults to `false`.
- `SAS_LOG_STRIP_ANSI`: Whether or not to strip ANSI characters from logs, defaults
    to `false`. Useful when logging RPC calls with JSON written to transports.
- `SAS_LOG_WRITE`: Whether or not to write logs to a log file. Default is set to `false`. Accepts a boolean value. The log files will be written as `logs.log`. **NOTE**: It will only log what is available depending on what `SAS_LOG_LEVEL` is set to.
- `SAS_LOG_WRITE_PATH`: Specifies the path to write the log files. Default will be where the package is installed.
- `SAS_LOG_WRITE_MAX_FILE_SIZE`: Specifies in bytes what the max file size for the written log files should be. Default is `5242880` (5MB). **NOTE** Once the the max amount of files have reached their max size, the logger will start to rewrite over the first log file.
- `SAS_LOG_WRITE_MAX_FILES`: Specifies how many files can be written. Default is 5.

#### Log levels

Log levels in order of decreasing importance are: `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`.

| http status code range | log level |
|------------------------|-----------|
| `code` < 400           | `http`    |
| 400 <= `code` < 500    | `warn`    |
| 500 < `code`           | `error`   |

#### RPC logging

If looking to track raw RPC requests/responses, one can use `yarn start:log-rpc` to turn on polkadot-js's
logging. It is recommended to also set `SAS_LOG_STRIP_ANSI=true` to increase the readability of the logging stream.

**N.B.** If running `yarn start:log-rpc`, the NODE_ENV will be set to `test`. In order still run your `.env`
file you can `symlink` it with `.env.test`. For example you could run
`ln -s .env.myEnv .env.test && yarn start:log-rpc` to use `.env.myEnv` to set ENV variables. (see linux
commands `ln` and `unlink` for more info.)

### Prometheus server

Prometheus metrics can be enabled by running sidecar with the following env configuration: `SAS_METRICS_ENABLED`=true

You can also expand the metrics tracking capabilities to include query params by adding to the env configuration: `SAS_METRICS_INCLUDE_QUERYPARAMS`=true

The metrics endpoint can then be accessed :
- on the default port : `http://127.0.0.1:9100/metrics` or
- on your custom port if you defined one : `http://127.0.0.1:<YOUR_CUSTOM_PORT>/metrics`

A JSON format response is available at `http://127.0.0.1:9100/metrics.json`.

That way you will have access to the default prometheus node instance metrics and the following metrics will be emitted for each route:

- `sas_http_request_error`: type counter and tracks http errors occuring in sidecar
- `sas_http_request_success`: type counter and tracks successfull http requests
- `sas_http_requests`: type counter and tracks all http requests
- `sas_request_duration_seconds`: type histogram and tracks the latency of the requests
- `sas_response_size_bytes_seconds`: type histogram and tracks the response size of the requests
- `sas_response_size_latency_ratio_seconds`: type histogram and tracks the response bytes per second of the requests

The blocks controller also includes the following route-specific metrics:

- `sas_extrinsics_in_request`: type histogram and tracks the number of extrinsics returned in the request when a range of blocks is queried
- `sas_extrinsics_per_second`: type histogram and tracks the returned extrinics per second
- `sas_extrinsics_per_block`: type histogram and tracks the returned extrinsics per block
- `sas_seconds_per_block`: type histogram and tracks the request time per block

The metrics registry is injected in the Response object when the `SAS_METRICS_ENABLED` flag is set to `true` in the `.env` file, allowing to extend the controller based metrics to any given controller from within the controller functions.

To successfully run and access the metrics and logs in Grafana (for example) the following are required:

- prometheus server (info [here](https://prometheus.io/docs/prometheus/latest/getting_started/))
- loki server and promtail (info [here](https://grafana.com/docs/loki/latest/setup/install/))

For mac users using homebrew:
```bash
brew install prometheus loki promtail
```

## Debugging fee and staking payout calculations

It is possible to get more information about the fee and staking payout calculation process logged to
the console. Because these calculations happens in the statically compiled web assembly part,
a re-compile with the proper environment variable set is necessary:

```bash
CALC_DEBUG=1 sh calc/build.sh
```

## Available endpoints

[Click here for full endpoint docs.](https://paritytech.github.io/substrate-api-sidecar/dist/)

## Chain integration guide

[Click here for chain integration guide.](./guides/CHAIN_INTEGRATION.md)

## Docker

With each release, the maintainers publish a docker image to dockerhub at [parity/substrate-api-sidecar](https://hub.docker.com/r/parity/substrate-api-sidecar/tags?page=1&ordering=last_updated)

### Pull the latest release

```bash
docker pull docker.io/parity/substrate-api-sidecar:latest
```

The specific image tag matches the release version.

### Or build from source

```bash
yarn build:docker
```

### Run

```bash
# For default use run:
docker run --rm -it --read-only -p 8080:8080 substrate-api-sidecar

# Or if you want to use environment variables set in `.env.docker`, run:
docker run --rm -it --read-only --env-file .env.docker -p 8080:8080 substrate-api-sidecar
```

**NOTE**: While you could omit the `--read-only` flag, it is **strongly recommended for containers used in production**.

then you can test with:

```bash
curl -s http://0.0.0.0:8080/blocks/head | jq
```

**N.B.** The docker flow presented here is just a sample to help get started. Modifications may be necessary for secure usage.

## Contribute

Need help or want to contribute ideas or code? Head over to our [CONTRIBUTING](./guides/CONTRIBUTING.md) doc for more information.

## Notes for maintainers

### Commits

All the commits in this repo follow the [Conventional Commits spec](https://www.conventionalcommits.org/en/v1.0.0/#summary). When merging a PR, make sure 1) to use squash merge and 2) that the title of the PR follows the Conventional Commits spec.

### Updating polkadot-js dependencies

1. Whenever the polkadot-js ecosystem releases a new version, it's important to keep up with these updates and review the release notes for any breaking changes or high priority updates. In order to update all the dependencies and resolutions, create a new branch, such as `yourname-update-pjs`, and then run `yarn up "@polkadot/*"` in that branch.

    - @polkadot/api [release notes](https://github.com/polkadot-js/api/releases)
    - @polkadot/util-crypto [release notes](https://github.com/polkadot-js/common/releases)
    - @substrate/calc [npm release page](https://www.npmjs.com/package/@substrate/calc)

1. Ensure everything is up to date and working by running the following:
   ```
   yarn
   yarn dedupe
   yarn build
   yarn lint
   yarn test
   yarn test:historical-e2e-tests
   yarn test:latest-e2e-tests
   ```

1. Commit the dependency updates with a name like `chore(deps): update polkadot-js deps` (adjust the title based on what was updated; refer to the commit history for examples). Then, wait for it to be merged.

1. Follow [RELEASE.md](./RELEASE.md) next if you're working through a full sidecar release. This will involve creating a separate PR where the changelog and versions are bumped.

### Maintenance Guide
A more complete list of the maintainer's tasks can be found in the [MAINTENANCE.md](./guides/MAINTENANCE.md) guide.

## Hardware requirements

### Disk Space
Sidecar is a stateless program and thus should not use any disk space.

### Memory
The requirements follow the default of node.js processes which is an upper bound in HEAP memory of a little less than 2GB thus 4GB of memory should be sufficient.

### Running sidecar and a node
Please note that if you run sidecar next to a substrate node in a single machine then your system specifications should improve significantly.
- Our official specifications related to validator nodes can be found in the polkadot wiki [page](https://wiki.polkadot.network/docs/maintain-guides-how-to-validate-polkadot#standard-hardware).
- Regarding archive nodes :
  - again as mentioned in the polkadot wiki [page](https://wiki.polkadot.network/docs/maintain-sync#types-of-nodes), the space needed from an archive node depends on which block we are currently on (of the specific chain we are referring to).
  - there are no other hardware requirements for an archive node since it is not time critical (archive nodes do not participate in the consensus).

### Benchmarks
During the benchmarks we performed, we concluded that sidecar would use a max of 1.1GB of RSS memory.

The benchmarks were:
- using 4 threads over 12 open http connections and
- were overloading the cache with every runtime possible on polkadot.

Hardware specs in which the benchmarks were performed:
```
Machine type:
n2-standard-4 (4 vCPUs, 16 GB memory)

CPU Platform:
Intel Cascade Lake

Hard-Disk:
500GB
```

Benchmarks are automatically published in Github pages under the url https://paritytech.github.io/substrate-api-sidecar/dev/bench/. The data in the graphs are updated with every new commit/push in the `master` branch (refer to the [benchmark.yml](https://github.com/paritytech/substrate-api-sidecar/blob/master/.github/workflows/benchmark.yml) for more details).
