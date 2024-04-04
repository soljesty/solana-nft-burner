import { Box, Button, Flex, Grid, Heading, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { INFTBurner } from './types';
import { StyledCheckBox, StyledSpan, StyledLabel } from './StyledComponents';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/router';
import { SolNFTListItem } from 'components/modules/SolNFTListItem';

// eslint-disable-next-line complexity
const NFTBurner: FC<INFTBurner> = ({ balances }) => {
  const borderColor = useColorModeValue('white', 'gray.800');
  useEffect(() => console.log('balances: ', balances), [balances]);
  const [nftsToDelete, setNftsToDelete] = useState<Array<string>>([]);
  const [status, SetStatus] = useState('');
  const toast = useToast();
  const route = useRouter();

  // eslint-disable-next-line no-undef
  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (!nftsToDelete?.includes(value) && checked) {
      setNftsToDelete((existing: Array<string>) => [...existing, value]);
    } else {
      const temp = nftsToDelete;
      if (temp.includes(value)) {
        temp.splice(temp.indexOf(value), 1);
        setNftsToDelete(() => [...temp]);
      }
    }
  };

  useEffect(() => {
    console.log(nftsToDelete);
  }, [nftsToDelete]);

  // Metaplex setup
  const wallet = useWallet();
  const connection = new Connection(clusterApiUrl('devnet'));
  const metaplex = new Metaplex(connection);

  const burnNFT = async () => {
    try {
      SetStatus('Burning has begun');
      metaplex.use(walletAdapterIdentity(wallet));

      const totalTxs = await Promise.all(
        nftsToDelete.map(async (nft) => {
          const tx = await metaplex
            .nfts()
            .delete({
              mintAddress: new PublicKey(nft),
            })
            .run();
          return tx;
        }),
      );
      console.log(totalTxs);
      SetStatus('');
      setNftsToDelete(() => []);
      route.replace(route.asPath);
      toast({
        title: 'Burning Successful',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    } catch (e) {
      if (e instanceof Error) {
        SetStatus('');
        setNftsToDelete(() => []);
        throw toast({
          title: 'Buring Failed',
          description: `${e.message}`,
          status: 'error',
          position: 'bottom-right',
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Heading size="lg" marginBottom={6}>
        NFT Burner
      </Heading>
      <Flex
        flexDirection={'row-reverse'}
        padding={'8px'}
        alignItems={'baseline'}
        gap={'8px'}
        position={'sticky'}
        top={'0'}
        backdropFilter="auto"
        backdropBlur="8px"
        borderBottom={'2px'}
        borderColor={borderColor}
      >
        <Button
          disabled={(nftsToDelete.length ? false : true) || (status ? true : false)}
          mt={4}
          colorScheme="teal"
          isLoading={status ? true : false}
          onClick={() => {
            burnNFT();
          }}
        >
          {nftsToDelete.length > 0 && `${nftsToDelete.length} x `} Burn🔥
        </Button>
        <Text fontSize={'md'} color={'red.300'} fontWeight={'bold'}>
          {!status ? (nftsToDelete.length ? 'Burn the selected NFT' : 'Select NFT to Burn') : status}
        </Text>
      </Flex>
      {balances?.length ? (
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {balances?.map((balance, key) => (
            <StyledLabel key={key}>
              <StyledCheckBox
                onChange={handleCheckbox}
                value={`${balance.mint}`}
                type={'checkbox'}
                checked={nftsToDelete.includes(`${balance.mint}`)}
              />
              <StyledSpan>
                <SolNFTListItem nftAddress={balance.mint} />
              </StyledSpan>
            </StyledLabel>
          ))}
        </Grid>
      ) : (
        <Box>Looks Like you do not have any NFTs to burn</Box>
      )}
    </>
  );
};

export default NFTBurner;
