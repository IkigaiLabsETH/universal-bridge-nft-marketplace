import { getCollectionMetadata, getCollectionNFTs } from './thirdweb';

const IKIGAI_CONTRACT = '0x7a63d17f5a59bca04b6702f461b1f1a1c59b100b';

async function testIKIGAICollection() {
  console.log('Fetching IKIGAI Labs collection metadata...');
  
  try {
    // Get collection metadata
    const metadata = await getCollectionMetadata(IKIGAI_CONTRACT);
    console.log('\nCollection Metadata:');
    console.log('-------------------');
    console.log('Name:', metadata?.name);
    console.log('Symbol:', metadata?.symbol);
    console.log('Total Supply:', metadata?.totalSupply);
    console.log('Owner:', metadata?.owner);
    console.log('Contract URI:', metadata?.contractURI);
    console.log('Base URI:', metadata?.baseURI);
    
    if (metadata?.royaltyInfo) {
      console.log('\nRoyalty Info:');
      console.log('Recipient:', metadata.royaltyInfo.recipient);
      console.log('BPS:', metadata.royaltyInfo.bps);
    }

    if (metadata?.roles) {
      console.log('\nRoles:');
      console.log('Admin Count:', metadata.roles.admin.length);
      console.log('Minter Count:', metadata.roles.minter.length);
      console.log('Transfer Count:', metadata.roles.transfer.length);
    }

    if (metadata?.supportsInterface) {
      console.log('\nInterface Support:');
      console.log('ERC721:', metadata.supportsInterface.ERC721);
      console.log('ERC721Metadata:', metadata.supportsInterface.ERC721Metadata);
      console.log('ERC721Enumerable:', metadata.supportsInterface.ERC721Enumerable);
    }

    // Get first 10 NFTs
    console.log('\nFetching first 10 NFTs...');
    const nfts = await getCollectionNFTs(IKIGAI_CONTRACT, 'ethereum', 0, 10);
    console.log('\nFirst 10 NFTs:');
    console.log('--------------');
    nfts.forEach((nft, index) => {
      console.log(`\nNFT #${index + 1}:`);
      console.log('ID:', nft.id);
      console.log('Name:', nft.name);
      console.log('Description:', nft.description);
      console.log('Image:', nft.image);
      if (nft.attributes.length > 0) {
        console.log('Attributes:', nft.attributes);
      }
    });

  } catch (error) {
    console.error('Error testing IKIGAI collection:', error);
  }
}

// Run the test
testIKIGAICollection(); 