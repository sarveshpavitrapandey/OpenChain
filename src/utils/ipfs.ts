import { create } from 'ipfs-http-client';

const projectId = import.meta.env.VITE_INFURA_PROJECT_ID || '';
const projectSecret = import.meta.env.VITE_INFURA_PROJECT_SECRET || '';
const auth = 'Basic ' + btoa(`${projectId}:${projectSecret}`);

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default client;
export const uploadToIPFS = async (file: File) => {
  try {
    const added = await client.add(file);
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};
export const uploadJSONToIPFS = async (json: object) => {
  try {
    const added = await client.add(JSON.stringify(json));
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw error;
  }
}