import { Box, Flex, HStack, Image, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { resolveIPFS } from 'utils/resolveIPFS';
import { FC } from 'react';
import apiPost from 'utils/apiPost';
import axios from 'axios';
import type { Metadata, NFTAddress } from './types';

const SolNFTListItem: FC<NFTAddress> = ({ nftAddress }) => {
  const bgColor = useColorModeValue('none', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const descBgColor = useColorModeValue('gray.100', 'gray.600');
  const [nftData, setNftData] = useState({ contractType: '', name: '', symbol: '', image: '' });

  const getNFTMetadata = async () => {
    const options = {
      network: 'devnet',
      address: nftAddress,
    };
    const response = await apiPost('/SolApi/nft/getNFTMetadata', options);
    const result = await axios.get<Metadata>(`${response.metaplex.metadataUri}`, {
      headers: {
        'content-type': 'application/json',
      },
    });
    setNftData({
      contractType: response.standard,
      name: result.data.name,
      symbol: result.data.symbol,
      image: result.data.image,
    });
  };

  useEffect(() => {
    if (nftAddress) {
      getNFTMetadata();
    }
  }, [nftAddress]);

  return (
    <>
      <Flex bgColor={bgColor} padding={3} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
        <Box overflow={'hidden'} borderRadius="xl">
          <Image
            src={resolveIPFS(nftData?.image)}
            alt={'nft'}
            minH="100px"
            minW="100px"
            boxSize="100px"
            objectFit="fill"
          />
        </Box>
        <SimpleGrid
          columns={1}
          row={2}
          spacing={4}
          bgColor={descBgColor}
          width={'60%'}
          padding={2.5}
          borderRadius="xl"
          marginTop={2}
        >
          <Box mt="1" fontWeight="semibold" as="h4" noOfLines={1}>
            {nftData?.name ? nftData?.name : <>no name</>}
          </Box>
          <HStack alignItems={'center'}>
            <Box as="h4" noOfLines={1} fontWeight="medium" fontSize="smaller">
              {nftData?.contractType} standard
            </Box>
          </HStack>
        </SimpleGrid>
      </Flex>
    </>
  );
};

export default SolNFTListItem;
