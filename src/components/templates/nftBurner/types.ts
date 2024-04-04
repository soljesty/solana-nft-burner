import Moralis from 'moralis';

export type TNFTBurner = Pick<Awaited<ReturnType<typeof Moralis.SolApi.account.getNFTs>>, 'result'>['result'];

export interface INFTBurner {
  balances?: TNFTBurner;
}
