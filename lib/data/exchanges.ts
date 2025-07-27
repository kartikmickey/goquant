
import { Exchange } from '../types';

export const exchanges: Exchange[] = [
  {
    id: 'binance-hk',
    name: 'Binance',
    lat: 22.3193,
    lng: 114.1694,
    provider: 'AWS',
    region: 'ap-east-1',
    active: true
  },
  {
    id: 'okx-hk',
    name: 'OKX',
    lat: 22.2783,
    lng: 114.1747,
    provider: 'GCP',
    region: 'asia-east2',
    active: true
  },
  {
    id: 'deribit-ams',
    name: 'Deribit',
    lat: 52.3676,
    lng: 4.9041,
    provider: 'AWS',
    region: 'eu-west-1',
    active: true
  },
  {
    id: 'bybit-sg',
    name: 'Bybit',
    lat: 1.3521,
    lng: 103.8198,
    provider: 'AWS',
    region: 'ap-southeast-1',
    active: true
  },
  {
    id: 'coinbase-us',
    name: 'Coinbase',
    lat: 37.7749,
    lng: -122.4194,
    provider: 'AWS',
    region: 'us-west-1',
    active: true
  },
  {
    id: 'kraken-uk',
    name: 'Kraken',
    lat: 51.5074,
    lng: -0.1278,
    provider: 'Azure',
    region: 'uk-south',
    active: true
  },
  {
    id: 'bitfinex-uk',
    name: 'Bitfinex',
    lat: 51.5074,
    lng: -0.1278,
    provider: 'GCP',
    region: 'europe-west2',
    active: true
  },
  {
    id: 'huobi-sg',
    name: 'Huobi',
    lat: 1.3521,
    lng: 103.8198,
    provider: 'Azure',
    region: 'southeast-asia',
    active: true
  },
  {
    id: 'ftx-jp',
    name: 'BitFlyer',
    lat: 35.6762,
    lng: 139.6503,
    provider: 'AWS',
    region: 'ap-northeast-1',
    active: true
  },
  {
    id: 'gemini-us',
    name: 'Gemini',
    lat: 40.7128,
    lng: -74.0060,
    provider: 'GCP',
    region: 'us-east4',
    active: true
  }
];

