
import { CloudRegion } from '../types';

export const cloudRegions: CloudRegion[] = [
  // AWS Regions
  {
    id: 'aws-us-east-1',
    provider: 'AWS',
    name: 'US East (N. Virginia)',
    code: 'us-east-1',
    lat: 38.7489,
    lng: -77.4761,
    serverCount: 6
  },
  {
    id: 'aws-us-west-1',
    provider: 'AWS',
    name: 'US West (N. California)',
    code: 'us-west-1',
    lat: 37.3541,
    lng: -121.9552,
    serverCount: 3
  },
  {
    id: 'aws-eu-west-1',
    provider: 'AWS',
    name: 'EU (Ireland)',
    code: 'eu-west-1',
    lat: 53.4129,
    lng: -8.2439,
    serverCount: 5
  },
  {
    id: 'aws-ap-southeast-1',
    provider: 'AWS',
    name: 'Asia Pacific (Singapore)',
    code: 'ap-southeast-1',
    lat: 1.3521,
    lng: 103.8198,
    serverCount: 4
  },
  {
    id: 'aws-ap-northeast-1',
    provider: 'AWS',
    name: 'Asia Pacific (Tokyo)',
    code: 'ap-northeast-1',
    lat: 35.6762,
    lng: 139.6503,
    serverCount: 4
  },
  
  // GCP Regions
  {
    id: 'gcp-us-central1',
    provider: 'GCP',
    name: 'Iowa',
    code: 'us-central1',
    lat: 41.8780,
    lng: -93.0977,
    serverCount: 4
  },
  {
    id: 'gcp-europe-west2',
    provider: 'GCP',
    name: 'London',
    code: 'europe-west2',
    lat: 51.5074,
    lng: -0.1278,
    serverCount: 3
  },
  {
    id: 'gcp-asia-east2',
    provider: 'GCP',
    name: 'Hong Kong',
    code: 'asia-east2',
    lat: 22.3193,
    lng: 114.1694,
    serverCount: 3
  },
  
  // Azure Regions
  {
    id: 'azure-east-us',
    provider: 'Azure',
    name: 'East US',
    code: 'eastus',
    lat: 37.3719,
    lng: -79.8164,
    serverCount: 5
  },
  {
    id: 'azure-uk-south',
    provider: 'Azure',
    name: 'UK South',
    code: 'uksouth',
    lat: 50.9410,
    lng: -0.7992,
    serverCount: 3
  },
  {
    id: 'azure-southeast-asia',
    provider: 'Azure',
    name: 'Southeast Asia',
    code: 'southeastasia',
    lat: 1.3521,
    lng: 103.8198,
    serverCount: 3
  }
];
