# Zerion Portfolio Mini App

The goal of this app is to show a visual representation of the current holdings of a wallet.
We have the wallet data from the connected wallet which we use wagmi for.
A donut diagram where the size of each holding is represented as percentage of the total
will be used for visualization.

## Core User Flow

The whole app is one page with a simple donut diagram in the middle and below a list of holding (ticker/symbol)
and it's percentage of total holdings as percent in a list.
In the chart we want to make sure that there are never more then 7 positions shown, if there are more
the 7th will be others and be the remaining percentage not covered by the top 6 holdings.
Below the pie chart please show a percentage of unrealized gain and the percentage of realized gain in percentage to the total value.
We do not show the exact numbers of the wallet, we just want to show the percentages!
The list view does not need a other section and is present below the donut diagram.

There is a button top right with a share icon that indicates we can share this overview.

When sharing we package the pie chart into an image using vercel/og and vercel/satori libraries.

## Portfolio data about the wallet.

To fetch the data needed to compile the pie chart we are using the Zerion API.

To get the total holdings of the User Zerion has an API endpoint to listwalletpopsitions with the full [reference docs on the web](https://developers.zerion.io/reference/listwalletpositions)

A curl command querying the API looks like

```
curl --request GET \
     --url 'https://api.zerion.io/v1/wallets/%3Cinsertaddress%3E/positions/?filter[positions]=only_simple&currency=usd&filter[chain_ids]=&filter[trash]=only_non_trash&sort=value' \
     --header 'accept: application/json' \
     --header 'authorization: Basic
```

where you can see it's a GET request with all options being put in as url parameters, which we don't need to adjust. though the address needs to be in between `.../wallets/<here>/positions/...`.

For wallet `0x09CEdb7bb69f9F6DF646dBa107D2bAACda93D6C9` the request is

```
curl --request GET \
     --url 'https://api.zerion.io/v1/wallets/0x09CEdb7bb69f9F6DF646dBa107D2bAACda93D6C9/positions/?filter[positions]=only_simple&currency=usd&filter[trash]=only_non_trash&sort=value' \
     --header 'accept: application/json' \
     --header 'authorization: Basic <auth>'
```

and the response returned

```json
{
  "links": {
    "self": "https://api.zerion.io/v1/wallets/{address}/positions/..."
  },
  "data": [
    {
      "type": "positions",
      "id": "base-base-asset-asset",
      "attributes": {
        "name": "Asset",
        "position_type": "wallet",
        "quantity": {
          "float": 0.0954452309998725,
          "decimals": 18
        },
        "value": 350.7010934290016,
        "price": 3674.37,
        "changes": {
          "absolute_1d": 3.5076122392453044,
          "percent_1d": 1.0102759496593894
        },
        "fungible_info": {
          "name": "Ethereum",
          "symbol": "ETH",
          "icon": {
            "url": "https://cdn.zerion.io/eth.png"
          },
          "flags": {
            "verified": true
          },
          "implementations": [
            {
              "chain_id": "ethereum",
              "address": null,
              "decimals": 18
            }
          ]
        },
        "flags": {
          "displayable": true,
          "is_trash": false
        }
      }
    },
    {
      "type": "positions",
      "id": "0x38b88d6568d61556d33592ad7bc24e89a7fb6691-base-asset-asset",
      "attributes": {
        "name": "Asset",
        "position_type": "wallet",
        "quantity": {
          "float": 24346223.76318639,
          "decimals": 18
        },
        "value": 172.82862461218323,
        "price": 0.00000709878568,
        "changes": {
          "absolute_1d": 28.206371589456353,
          "percent_1d": 19.503479582097107
        },
        "fungible_info": {
          "name": "Operating System",
          "symbol": "OPSYS",
          "icon": {
            "url": "https://cdn.zerion.io/b9056b74-947e-4b78-a3b2-387e4cd58bf3.png"
          },
          "flags": {
            "verified": false
          },
          "implementations": [
            {
              "chain_id": "base",
              "address": "0x38b88d6568d61556d33592ad7bc24e89a7fb6691",
              "decimals": 18
            }
          ]
        },
        "flags": {
          "displayable": true,
          "is_trash": false
        }
      }
    }
  ]
}
```

The total value of positions we can sum up or call the Zerion portfolio API endpoint getwalletportfolio with docs
available [here on getwalletportfolio](https://developers.zerion.io/reference/getwalletportfolio).

A curl request looks like

```
curl --request GET \
     --url 'https://api.zerion.io/v1/wallets/0x09CEdb7bb69f9F6DF646dBa107D2bAACda93D6C9/portfolio?filter[positions]=only_simple&currency=usd' \
     --header 'accept: application/json' \
     --header 'authorization: Basic <auth>'
```

where the response is the following json of which we care about the data:

```
{
  "links": {
    "self": "https://api.zerion.io/v1/wallets/0x09cedb7bb69f9f6df646dba107d2baacda93d6c9/portfolio?currency=usd&filter%5Bpositions%5D=only_simple"
  },
  "data": {
    "type": "portfolio",
    "id": "0x09cedb7bb69f9f6df646dba107d2baacda93d6c9",
    "attributes": {
      "positions_distribution_by_type": {
        "wallet": 1016.1815241822967,
        "deposited": 0,
        "borrowed": 0,
        "locked": 0,
        "staked": 0
      },
      "positions_distribution_by_chain": {
        "arbitrum": 1.998374166,
        "base": 953.2041331959239,
        "degen": 0.1606844507469798,
        "ethereum": 0.11279956728349098,
        "optimism": 55.76057873548547,
        "polygon": 2.9426065627323785,
        "zora": 2.0023475041244967
      },
      "total": {
        "positions": 1016.1815241822967
      },
      "changes": {
        "absolute_1d": 13.932758380221102,
        "percent_1d": 1.3901497168790276
      }
    }
  }
}
```

To get the total Profit and loss as well as unrelized gain, fees paid and how muhc was net invested sent and recieved we can use the pnl endpoint.

A curl request looks like

```
curl --request GET \
     --url 'https://api.zerion.io/v1/wallets/0x09cedb7bb69f9f6df646dba107d2baacda93d6c9/pnl/?currency=usd' \
     --header 'accept: application/json' \
     --header 'authorization: Basic <auth>'
```

with the response being the following data that contains wallet_pnl data we can visualize.

```
{
  "links": {
    "self": "https://api.zerion.io/v1/wallets/0x09cedb7bb69f9f6df646dba107d2baacda93d6c9/pnl?currency=usd&filter%5Bchain_ids%5D=abstract%2Cape%2Carbitrum%2Caurora%2Cavalanche%2Cbase%2Cberachain%2Cbinance-smart-chain%2Cblast%2Ccelo%2Cdegen%2Cethereum%2Cfantom%2Cgravity-alpha%2Chyperevm%2Cink%2Ckatana%2Clens%2Clinea%2Cmantle%2Coptimism%2Cpolygon-zkevm%2Cpolygon%2Cscroll%2Csolana%2Csoneium%2Csonic%2Cunichain%2Cwonder%2Cworld%2Cxdai%2Cxinfin-xdc%2Czero%2Czkcandy%2Czksync-era%2Czora"
  },
  "data": {
    "type": "wallet_pnl",
    "id": "0x09cedb7bb69f9f6df646dba107d2baacda93d6c9",
    "attributes": {
      "realized_gain": 12880.900165606576,
      "unrealized_gain": -625.0835907645715,
      "total_fee": 552.9136119130735,
      "net_invested": 1602.9991495248391,
      "received_external": 67882.46787271027,
      "sent_external": 66016.74877458283,
      "sent_for_nfts": 4851.2623624164535,
      "received_for_nfts": 5.319035229714944
    }
  }
}
```

## Documentation

To read about the Zerion API refer to [the llms.txt file with references](../agent/zerion-llms.txt).
You are allowed to request any documentation page and look at it for API docs about portfolio data gathering using Zerion APIs.
