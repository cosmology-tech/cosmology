 /* eslint-disable */ 
export const pools =[
    {
        "nickname": "ATOM/OSMO",
        "images": [
            {
                "token": "ATOM",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                }
            },
            {
                "token": "OSMO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1mw0ac6rwlp5r8wapwk3zs6g29h8fcscxqakdzw9emkne6c8wjp9q0t3v8t",
        "id": "1",
        "poolParams": {
            "swapFee": "0.003000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/1",
            "amount": "344207870927163764996457049"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "amount": "6564733062275"
                },
                "weight": "536870912000000"
            },
            {
                "token": {
                    "denom": "uosmo",
                    "amount": "24835305327149"
                },
                "weight": "536870912000000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "ATOM",
                "amount": "6564733062275",
                "ratio": 0.5,
                "info": {
                    "description": "The native staking and governance token of the Cosmos Hub.",
                    "denom_units": [
                        {
                            "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                            "exponent": 0,
                            "aliases": [
                                "uatom"
                            ]
                        },
                        {
                            "denom": "atom",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "name": "Cosmos",
                    "display": "atom",
                    "symbol": "ATOM",
                    "ibc": {
                        "source_channel": "channel-141",
                        "dst_channel": "channel-0",
                        "source_denom": "uatom"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                    },
                    "coingecko_id": "cosmos"
                }
            },
            {
                "symbol": "OSMO",
                "amount": "24835305327149",
                "ratio": 0.5,
                "info": {
                    "description": "The native token of Osmosis",
                    "denom_units": [
                        {
                            "denom": "uosmo",
                            "exponent": 0,
                            "aliases": []
                        },
                        {
                            "denom": "osmo",
                            "exponent": 6,
                            "aliases": []
                        }
                    ],
                    "base": "uosmo",
                    "name": "Osmosis",
                    "display": "osmo",
                    "symbol": "OSMO",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                    },
                    "coingecko_id": "osmosis"
                }
            }
        ]
    },
    {
        "nickname": "ION/OSMO",
        "images": [
            {
                "token": "ION",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/ion.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/ion.svg"
                }
            },
            {
                "token": "OSMO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1500hy75krs9e8t50aav6fahk8sxhajn9ctp40qwvvn8tcprkk6wszun4a5",
        "id": "2",
        "poolParams": {
            "swapFee": "0.005000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/2",
            "amount": "536741877153565539338956678"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "uion",
                    "amount": "1197652388"
                },
                "weight": "858993459200000"
            },
            {
                "token": {
                    "denom": "uosmo",
                    "amount": "349136251946"
                },
                "weight": "214748364800000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "ION",
                "amount": "1197652388",
                "ratio": 0.8,
                "info": {
                    "denom_units": [
                        {
                            "denom": "uion",
                            "exponent": 0
                        },
                        {
                            "denom": "ion",
                            "exponent": 6
                        }
                    ],
                    "base": "uion",
                    "name": "Ion",
                    "display": "ion",
                    "symbol": "ION",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/ion.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/ion.svg"
                    },
                    "coingecko_id": "ion"
                }
            },
            {
                "symbol": "OSMO",
                "amount": "349136251946",
                "ratio": 0.2,
                "info": {
                    "description": "The native token of Osmosis",
                    "denom_units": [
                        {
                            "denom": "uosmo",
                            "exponent": 0,
                            "aliases": []
                        },
                        {
                            "denom": "osmo",
                            "exponent": 6,
                            "aliases": []
                        }
                    ],
                    "base": "uosmo",
                    "name": "Osmosis",
                    "display": "osmo",
                    "symbol": "OSMO",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                    },
                    "coingecko_id": "osmosis"
                }
            }
        ]
    },
    {
        "nickname": "AKT/OSMO",
        "images": [
            {
                "token": "AKT",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/akt.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/akt.svg"
                }
            },
            {
                "token": "OSMO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1c9gj5nwxhuh2gz7wwg4r8e8tw8v7ggy9lh2hu7kkdgh0t450754qh9cpvd",
        "id": "3",
        "poolParams": {
            "swapFee": "0.002000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/3",
            "amount": "108981617951904556110503828"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
                    "amount": "4486335906817"
                },
                "weight": "536870912000000"
            },
            {
                "token": {
                    "denom": "uosmo",
                    "amount": "837740208818"
                },
                "weight": "536870912000000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "AKT",
                "amount": "4486335906817",
                "ratio": 0.5,
                "info": {
                    "description": "Akash Token (AKT) is the Akash Network's native utility token, used as the primary means to govern, secure the blockchain, incentivize participants, and provide a default mechanism to store and exchange value.",
                    "denom_units": [
                        {
                            "denom": "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
                            "exponent": 0,
                            "aliases": [
                                "uakt"
                            ]
                        },
                        {
                            "denom": "akt",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
                    "name": "Akash Network",
                    "display": "akt",
                    "symbol": "AKT",
                    "ibc": {
                        "source_channel": "channel-9",
                        "dst_channel": "channel-1",
                        "source_denom": "uakt"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/akt.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/akt.svg"
                    },
                    "coingecko_id": "akash-network"
                }
            },
            {
                "symbol": "OSMO",
                "amount": "837740208818",
                "ratio": 0.5,
                "info": {
                    "description": "The native token of Osmosis",
                    "denom_units": [
                        {
                            "denom": "uosmo",
                            "exponent": 0,
                            "aliases": []
                        },
                        {
                            "denom": "osmo",
                            "exponent": 6,
                            "aliases": []
                        }
                    ],
                    "base": "uosmo",
                    "name": "Osmosis",
                    "display": "osmo",
                    "symbol": "OSMO",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                    },
                    "coingecko_id": "osmosis"
                }
            }
        ]
    },
    {
        "nickname": "AKT/ATOM",
        "images": [
            {
                "token": "AKT",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/akt.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/akt.svg"
                }
            },
            {
                "token": "ATOM",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1lzwv0glchfcw0fpwzdwfdsepmvluv6z6eh4qunxdml33sj06q3yq7xwtde",
        "id": "4",
        "poolParams": {
            "swapFee": "0.003000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/4",
            "amount": "57520914898452548851766133"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
                    "amount": "5224372540635"
                },
                "weight": "708669603840000"
            },
            {
                "token": {
                    "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "amount": "132413908071"
                },
                "weight": "365072220160000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "AKT",
                "amount": "5224372540635",
                "ratio": 0.66,
                "info": {
                    "description": "Akash Token (AKT) is the Akash Network's native utility token, used as the primary means to govern, secure the blockchain, incentivize participants, and provide a default mechanism to store and exchange value.",
                    "denom_units": [
                        {
                            "denom": "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
                            "exponent": 0,
                            "aliases": [
                                "uakt"
                            ]
                        },
                        {
                            "denom": "akt",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/1480B8FD20AD5FCAE81EA87584D269547DD4D436843C1D20F15E00EB64743EF4",
                    "name": "Akash Network",
                    "display": "akt",
                    "symbol": "AKT",
                    "ibc": {
                        "source_channel": "channel-9",
                        "dst_channel": "channel-1",
                        "source_denom": "uakt"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/akt.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/akt.svg"
                    },
                    "coingecko_id": "akash-network"
                }
            },
            {
                "symbol": "ATOM",
                "amount": "132413908071",
                "ratio": 0.34,
                "info": {
                    "description": "The native staking and governance token of the Cosmos Hub.",
                    "denom_units": [
                        {
                            "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                            "exponent": 0,
                            "aliases": [
                                "uatom"
                            ]
                        },
                        {
                            "denom": "atom",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "name": "Cosmos",
                    "display": "atom",
                    "symbol": "ATOM",
                    "ibc": {
                        "source_channel": "channel-141",
                        "dst_channel": "channel-0",
                        "source_denom": "uatom"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                    },
                    "coingecko_id": "cosmos"
                }
            }
        ]
    },
    {
        "nickname": "DVPN/OSMO",
        "images": [
            {
                "token": "DVPN",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/dvpn.png"
                }
            },
            {
                "token": "OSMO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1j5l9ysw5xv0uqz9uh7mcg0l5rlerqm695ec9kkg2t8rp600zv47q82eqwa",
        "id": "5",
        "poolParams": {
            "swapFee": "0.002000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/5",
            "amount": "19779236848291921148740848837"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
                    "amount": "595650156803472"
                },
                "weight": "536870912000000"
            },
            {
                "token": {
                    "denom": "uosmo",
                    "amount": "704821860725"
                },
                "weight": "536870912000000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "DVPN",
                "amount": "595650156803472",
                "ratio": 0.5,
                "info": {
                    "description": "DVPN is the native token of the Sentinel Hub.",
                    "denom_units": [
                        {
                            "denom": "ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
                            "exponent": 0,
                            "aliases": [
                                "udvpn"
                            ]
                        },
                        {
                            "denom": "dvpn",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
                    "name": "Sentinel",
                    "display": "dvpn",
                    "symbol": "DVPN",
                    "ibc": {
                        "source_channel": "channel-0",
                        "dst_channel": "channel-2",
                        "source_denom": "udvpn"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/dvpn.png"
                    },
                    "coingecko_id": "sentinel"
                }
            },
            {
                "symbol": "OSMO",
                "amount": "704821860725",
                "ratio": 0.5,
                "info": {
                    "description": "The native token of Osmosis",
                    "denom_units": [
                        {
                            "denom": "uosmo",
                            "exponent": 0,
                            "aliases": []
                        },
                        {
                            "denom": "osmo",
                            "exponent": 6,
                            "aliases": []
                        }
                    ],
                    "base": "uosmo",
                    "name": "Osmosis",
                    "display": "osmo",
                    "symbol": "OSMO",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                    },
                    "coingecko_id": "osmosis"
                }
            }
        ]
    },
    {
        "nickname": "ATOM/DVPN",
        "images": [
            {
                "token": "ATOM",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                }
            },
            {
                "token": "DVPN",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/dvpn.png"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1p0rpttlp8v2hy7m82l2t9p6545788f2ac3yksgrlycke2wr4mu0qdr7ytu",
        "id": "6",
        "poolParams": {
            "swapFee": "0.003000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/6",
            "amount": "27086836729045698150158108672"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "amount": "92335666685"
                },
                "weight": "322122547200000"
            },
            {
                "token": {
                    "denom": "ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
                    "amount": "689743020305897"
                },
                "weight": "751619276800000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "ATOM",
                "amount": "92335666685",
                "ratio": 0.3,
                "info": {
                    "description": "The native staking and governance token of the Cosmos Hub.",
                    "denom_units": [
                        {
                            "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                            "exponent": 0,
                            "aliases": [
                                "uatom"
                            ]
                        },
                        {
                            "denom": "atom",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "name": "Cosmos",
                    "display": "atom",
                    "symbol": "ATOM",
                    "ibc": {
                        "source_channel": "channel-141",
                        "dst_channel": "channel-0",
                        "source_denom": "uatom"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                    },
                    "coingecko_id": "cosmos"
                }
            },
            {
                "symbol": "DVPN",
                "amount": "689743020305897",
                "ratio": 0.7,
                "info": {
                    "description": "DVPN is the native token of the Sentinel Hub.",
                    "denom_units": [
                        {
                            "denom": "ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
                            "exponent": 0,
                            "aliases": [
                                "udvpn"
                            ]
                        },
                        {
                            "denom": "dvpn",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/9712DBB13B9631EDFA9BF61B55F1B2D290B2ADB67E3A4EB3A875F3B6081B3B84",
                    "name": "Sentinel",
                    "display": "dvpn",
                    "symbol": "DVPN",
                    "ibc": {
                        "source_channel": "channel-0",
                        "dst_channel": "channel-2",
                        "source_denom": "udvpn"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/dvpn.png"
                    },
                    "coingecko_id": "sentinel"
                }
            }
        ]
    },
    {
        "nickname": "IRIS/OSMO",
        "images": [
            {
                "token": "IRIS",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/iris.png"
                }
            },
            {
                "token": "OSMO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo13jr3p5p070h4pu7sxhtldag9899sev9pwx0r2vlvpkyravpxlqssnzsuq9",
        "id": "7",
        "poolParams": {
            "swapFee": "0.002000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/7",
            "amount": "915411819997235996064894647"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
                    "amount": "27483439305861"
                },
                "weight": "536870912000000"
            },
            {
                "token": {
                    "denom": "uosmo",
                    "amount": "226119324886"
                },
                "weight": "536870912000000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "IRIS",
                "amount": "27483439305861",
                "ratio": 0.5,
                "info": {
                    "description": "The IRIS token is the native governance token for the IrisNet chain.",
                    "denom_units": [
                        {
                            "denom": "ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
                            "exponent": 0,
                            "aliases": [
                                "uiris"
                            ]
                        },
                        {
                            "denom": "iris",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
                    "name": "IRISnet",
                    "display": "iris",
                    "symbol": "IRIS",
                    "ibc": {
                        "source_channel": "channel-3",
                        "dst_channel": "channel-6",
                        "source_denom": "uiris"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/iris.png"
                    },
                    "coingecko_id": "iris-network"
                }
            },
            {
                "symbol": "OSMO",
                "amount": "226119324886",
                "ratio": 0.5,
                "info": {
                    "description": "The native token of Osmosis",
                    "denom_units": [
                        {
                            "denom": "uosmo",
                            "exponent": 0,
                            "aliases": []
                        },
                        {
                            "denom": "osmo",
                            "exponent": 6,
                            "aliases": []
                        }
                    ],
                    "base": "uosmo",
                    "name": "Osmosis",
                    "display": "osmo",
                    "symbol": "OSMO",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                    },
                    "coingecko_id": "osmosis"
                }
            }
        ]
    },
    {
        "nickname": "ATOM/IRIS",
        "images": [
            {
                "token": "ATOM",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                }
            },
            {
                "token": "IRIS",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/iris.png"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1605py4r32r73csszlqpz6n5t5sgax9gjjfnm68jnd7pv6qe4l54ql0w8ku",
        "id": "8",
        "poolParams": {
            "swapFee": "0.003000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/8",
            "amount": "281993895065547585641344230"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "amount": "66734698438"
                },
                "weight": "644245094400000"
            },
            {
                "token": {
                    "denom": "ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
                    "amount": "20484948083949"
                },
                "weight": "429496729600000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "ATOM",
                "amount": "66734698438",
                "ratio": 0.6,
                "info": {
                    "description": "The native staking and governance token of the Cosmos Hub.",
                    "denom_units": [
                        {
                            "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                            "exponent": 0,
                            "aliases": [
                                "uatom"
                            ]
                        },
                        {
                            "denom": "atom",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "name": "Cosmos",
                    "display": "atom",
                    "symbol": "ATOM",
                    "ibc": {
                        "source_channel": "channel-141",
                        "dst_channel": "channel-0",
                        "source_denom": "uatom"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                    },
                    "coingecko_id": "cosmos"
                }
            },
            {
                "symbol": "IRIS",
                "amount": "20484948083949",
                "ratio": 0.4,
                "info": {
                    "description": "The IRIS token is the native governance token for the IrisNet chain.",
                    "denom_units": [
                        {
                            "denom": "ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
                            "exponent": 0,
                            "aliases": [
                                "uiris"
                            ]
                        },
                        {
                            "denom": "iris",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0",
                    "name": "IRISnet",
                    "display": "iris",
                    "symbol": "IRIS",
                    "ibc": {
                        "source_channel": "channel-3",
                        "dst_channel": "channel-6",
                        "source_denom": "uiris"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/iris.png"
                    },
                    "coingecko_id": "iris-network"
                }
            }
        ]
    },
    {
        "nickname": "CRO/OSMO",
        "images": [
            {
                "token": "CRO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/cro.png"
                }
            },
            {
                "token": "OSMO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo19fm8jtzyw8ujsnsqm5rznudn8fhhkykjh4ra8rvx9lsfslw2pc2sp36h3r",
        "id": "9",
        "poolParams": {
            "swapFee": "0.002000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/9",
            "amount": "1627201296366106465992274114"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
                    "amount": "2433824420027593"
                },
                "weight": "536870912000000"
            },
            {
                "token": {
                    "denom": "uosmo",
                    "amount": "1185831626341"
                },
                "weight": "536870912000000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "CRO",
                "amount": "2433824420027593",
                "ratio": 0.5,
                "info": {
                    "description": "CRO coin is the token for the Crypto.com platform.",
                    "denom_units": [
                        {
                            "denom": "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
                            "exponent": 0,
                            "aliases": [
                                "basecro"
                            ]
                        },
                        {
                            "denom": "cro",
                            "exponent": 8
                        }
                    ],
                    "base": "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
                    "name": "Crypto.com Coin",
                    "display": "cro",
                    "symbol": "CRO",
                    "ibc": {
                        "source_channel": "channel-10",
                        "dst_channel": "channel-5",
                        "source_denom": "basecro"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/cro.png"
                    },
                    "coingecko_id": "crypto-com-chain"
                }
            },
            {
                "symbol": "OSMO",
                "amount": "1185831626341",
                "ratio": 0.5,
                "info": {
                    "description": "The native token of Osmosis",
                    "denom_units": [
                        {
                            "denom": "uosmo",
                            "exponent": 0,
                            "aliases": []
                        },
                        {
                            "denom": "osmo",
                            "exponent": 6,
                            "aliases": []
                        }
                    ],
                    "base": "uosmo",
                    "name": "Osmosis",
                    "display": "osmo",
                    "symbol": "OSMO",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                    },
                    "coingecko_id": "osmosis"
                }
            }
        ]
    },
    {
        "nickname": "ATOM/CRO",
        "images": [
            {
                "token": "ATOM",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                }
            },
            {
                "token": "CRO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/cro.png"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1krp38zzc3zz5as9ndqkyskhkzv6x9e30ckcq5g4lcsu5wpwcqy0sa3dea2",
        "id": "10",
        "poolParams": {
            "swapFee": "0.003000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/10",
            "amount": "2016259074002073261311767996"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "amount": "221315640347"
                },
                "weight": "536870912000000"
            },
            {
                "token": {
                    "denom": "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
                    "amount": "1715764645550316"
                },
                "weight": "536870912000000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "ATOM",
                "amount": "221315640347",
                "ratio": 0.5,
                "info": {
                    "description": "The native staking and governance token of the Cosmos Hub.",
                    "denom_units": [
                        {
                            "denom": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                            "exponent": 0,
                            "aliases": [
                                "uatom"
                            ]
                        },
                        {
                            "denom": "atom",
                            "exponent": 6
                        }
                    ],
                    "base": "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                    "name": "Cosmos",
                    "display": "atom",
                    "symbol": "ATOM",
                    "ibc": {
                        "source_channel": "channel-141",
                        "dst_channel": "channel-0",
                        "source_denom": "uatom"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/atom.svg"
                    },
                    "coingecko_id": "cosmos"
                }
            },
            {
                "symbol": "CRO",
                "amount": "1715764645550316",
                "ratio": 0.5,
                "info": {
                    "description": "CRO coin is the token for the Crypto.com platform.",
                    "denom_units": [
                        {
                            "denom": "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
                            "exponent": 0,
                            "aliases": [
                                "basecro"
                            ]
                        },
                        {
                            "denom": "cro",
                            "exponent": 8
                        }
                    ],
                    "base": "ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1",
                    "name": "Crypto.com Coin",
                    "display": "cro",
                    "symbol": "CRO",
                    "ibc": {
                        "source_channel": "channel-10",
                        "dst_channel": "channel-5",
                        "source_denom": "basecro"
                    },
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/cro.png"
                    },
                    "coingecko_id": "crypto-com-chain"
                }
            }
        ]
    },
    {
        "nickname": "ION/OSMO",
        "images": [
            {
                "token": "ION",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/ion.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/ion.svg"
                }
            },
            {
                "token": "OSMO",
                "images": {
                    "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                    "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                }
            }
        ],
        "@type": "/osmosis.gamm.v1beta1.Pool",
        "address": "osmo1zka4v4c04jr74ludyls2lfzfttzx67qzd070xtnfq90yzyacgn9qv6vend",
        "id": "11",
        "poolParams": {
            "swapFee": "0.005000000000000000",
            "exitFee": "0.000000000000000000",
            "smoothWeightChangeParams": null
        },
        "future_pool_governor": "24h",
        "totalShares": {
            "denom": "gamm/pool/11",
            "amount": "3246614910750647812469"
        },
        "poolAssets": [
            {
                "token": {
                    "denom": "uion",
                    "amount": "645743"
                },
                "weight": "536870912000000"
            },
            {
                "token": {
                    "denom": "uosmo",
                    "amount": "745627594"
                },
                "weight": "536870912000000"
            }
        ],
        "totalWeight": "1073741824000000",
        "poolAssetsPretty": [
            {
                "symbol": "ION",
                "amount": "645743",
                "ratio": 0.5,
                "info": {
                    "denom_units": [
                        {
                            "denom": "uion",
                            "exponent": 0
                        },
                        {
                            "denom": "ion",
                            "exponent": 6
                        }
                    ],
                    "base": "uion",
                    "name": "Ion",
                    "display": "ion",
                    "symbol": "ION",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/ion.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/ion.svg"
                    },
                    "coingecko_id": "ion"
                }
            },
            {
                "symbol": "OSMO",
                "amount": "745627594",
                "ratio": 0.5,
                "info": {
                    "description": "The native token of Osmosis",
                    "denom_units": [
                        {
                            "denom": "uosmo",
                            "exponent": 0,
                            "aliases": []
                        },
                        {
                            "denom": "osmo",
                            "exponent": 6,
                            "aliases": []
                        }
                    ],
                    "base": "uosmo",
                    "name": "Osmosis",
                    "display": "osmo",
                    "symbol": "OSMO",
                    "logo_URIs": {
                        "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
                        "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
                    },
                    "coingecko_id": "osmosis"
                }
            }
        ]
    }
];