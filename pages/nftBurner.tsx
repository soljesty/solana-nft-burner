import { Default } from 'components/layouts/Default';
import { GetServerSideProps, NextPage } from 'next';
import NFTBurner from 'components/templates/nftBurner/NFTBurner';
import { ISolNFTBalances } from 'components/templates/balances/SolNFT/types';
import Moralis from 'moralis';
import { getSession } from 'next-auth/react';

const NFTBurnerPage: NextPage<ISolNFTBalances> = (props) => {
  return (
    <Default pageName="NFT Burner">
      <NFTBurner {...props} />
    </Default>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  if (!session?.user.address) {
    return { props: { error: 'Connect your wallet first' } };
  }

  const balances = await Moralis.SolApi.account.getNFTs({
    address: session?.user.address,
    network: process.env.APP_CHAIN_ID,
  });

  return {
    props: {
      balances: JSON.parse(JSON.stringify(balances.result)),
    },
  };
};

export default NFTBurnerPage;
