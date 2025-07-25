// Copyright 2017-2025 Parity Technologies (UK) Ltd.
// This file is part of Substrate API Sidecar.
//
// Substrate API Sidecar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { ApiPromise } from '@polkadot/api';

import { ApiPromiseRegistry } from '../../apiRegistry';
import { sanitizeNumbers } from '../../sanitize/sanitizeNumbers';
import { foreignAssetsMetadata } from '../test-helpers/mock/assets/mockAssetHubKusamaData';
import { foreignAssetsMetadataWestendAH } from '../test-helpers/mock/assets/mockAssetHubWestendData';
import { foreignAssetsEntries, foreignAssetsEntriesWestendAH } from '../test-helpers/mock/data/foreignAssetsEntries';
import { mockAssetHubKusamaApi } from '../test-helpers/mock/mockAssetHubKusamaApi';
import { mockAssetHubWestendApi } from '../test-helpers/mock/mockAssetHubWestendApi';
import { blockHash523510 } from '../test-helpers/mock/mockBlock523510';
import { blockHash5236177 } from '../test-helpers/mock/mockBlock5236177';
import foreignAssetsResponse from '../test-helpers/responses/pallets/foreignAssetsResponse.json';
import { PalletsForeignAssetsService } from './PalletsForeignAssetsService';

const foreignAssetsEntriesAt = () => Promise.resolve().then(() => foreignAssetsEntries());

const mockApi = {
	...mockAssetHubKusamaApi,
	query: {
		foreignAssets: {
			asset: {
				entries: foreignAssetsEntriesAt,
			},
			metadata: foreignAssetsMetadata,
		},
	},
} as unknown as ApiPromise;

const palletsForeignAssetsService = new PalletsForeignAssetsService('mock');

describe('PalletsForeignAssetsService', () => {
	describe('PalletsForeignAssetsService.fetchForeignAssets', () => {
		it('Should return the correct response for Foreign Assets', async () => {
			const expectedResponse = {
				at: {
					hash: '0x814bb69eba28cf13066aa025d39526b503fc563162f1301c627548b9ccec54c8',
					height: '523510',
				},
				items: [
					{
						multiLocation: {
							parents: '2',
							interior: {
								X1: {
									GlobalConsensus: 'Polkadot',
								},
							},
						},
						foreignAssetInfo: {
							owner: 'FxqimVubBRPqJ8kTwb3wL7G4q645hEkBEnXPyttLsTrFc5Q',
							issuer: 'FxqimVubBRPqJ8kTwb3wL7G4q645hEkBEnXPyttLsTrFc5Q',
							admin: 'FxqimVubBRPqJ8kTwb3wL7G4q645hEkBEnXPyttLsTrFc5Q',
							freezer: 'FxqimVubBRPqJ8kTwb3wL7G4q645hEkBEnXPyttLsTrFc5Q',
							supply: '0',
							deposit: '0',
							minBalance: '100000000',
							isSufficient: true,
							accounts: '0',
							sufficients: '0',
							approvals: '0',
							status: 'Live',
						},
						foreignAssetMetadata: {
							deposit: '0',
							name: '0x506f6c6b61646f74',
							symbol: '0x444f54',
							decimals: '10',
							isFrozen: false,
						},
					},
					{
						multiLocation: {
							parents: '1',
							interior: {
								X2: [
									{
										Parachain: '2,125',
									},
									{
										GeneralIndex: '0',
									},
								],
							},
						},
						foreignAssetInfo: {
							owner: 'FBeL7DiQ6JkoypYATheXhH3GQr5de2L3hL444TP6qQr3yA9',
							issuer: 'FBeL7DiQ6JkoypYATheXhH3GQr5de2L3hL444TP6qQr3yA9',
							admin: 'FBeL7DiQ6JkoypYATheXhH3GQr5de2L3hL444TP6qQr3yA9',
							freezer: 'FBeL7DiQ6JkoypYATheXhH3GQr5de2L3hL444TP6qQr3yA9',
							supply: '0',
							deposit: '100000000000',
							minBalance: '1000000000',
							isSufficient: false,
							accounts: '0',
							sufficients: '0',
							approvals: '0',
							status: 'Live',
						},
						foreignAssetMetadata: {
							deposit: '6693666633',
							name: '0x54696e6b65726e6574',
							symbol: '0x544e4b52',
							decimals: '12',
							isFrozen: false,
						},
					},
				],
			};

			jest.spyOn(ApiPromiseRegistry, 'getApi').mockImplementation(() => mockApi);
			const response = await palletsForeignAssetsService.fetchForeignAssets(blockHash523510);

			expect(sanitizeNumbers(response)).toStrictEqual(expectedResponse);
		});
	});
});

const foreignAssetsEntriesAtWAH = () => Promise.resolve().then(() => foreignAssetsEntriesWestendAH());

const mockApiWAH = {
	...mockAssetHubWestendApi,
	query: {
		foreignAssets: {
			asset: {
				entries: foreignAssetsEntriesAtWAH,
			},
			metadata: foreignAssetsMetadataWestendAH,
		},
	},
} as unknown as ApiPromise;

const palletsForeignAssetsServiceWAH = new PalletsForeignAssetsService('mock');

describe('PalletsForeignAssetsService', () => {
	describe('PalletsForeignAssetsService.fetchForeignAssets', () => {
		it('Should return the correct response for Foreign Assets', async () => {
			jest.spyOn(ApiPromiseRegistry, 'getApi').mockImplementation(() => mockApiWAH);
			const response = await palletsForeignAssetsServiceWAH.fetchForeignAssets(blockHash5236177);

			expect(sanitizeNumbers(response)).toStrictEqual(foreignAssetsResponse);
		});
	});
});
