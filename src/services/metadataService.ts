
import { supabase } from '../integrations/supabase/client';
import { OffchainMetadata } from '../types/blockchain';

// Store paper metadata in Supabase
export const storePaperMetadata = async (
  paperId: string, 
  userId: string, 
  metadata: OffchainMetadata
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('paper_metadata')
      .insert({
        paper_id: paperId,
        user_id: userId,
        ...metadata,
        created_at: new Date()
      });

    if (error) {
      console.error('Error storing paper metadata:', error);
      throw error;
    }

    console.log('Paper metadata stored successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in storePaperMetadata:', error);
    return false;
  }
};

// Get paper metadata from Supabase
export const getPaperMetadata = async (paperId: string): Promise<OffchainMetadata | null> => {
  try {
    const { data, error } = await supabase
      .from('paper_metadata')
      .select('*')
      .eq('paper_id', paperId)
      .single();

    if (error) {
      console.error('Error fetching paper metadata:', error);
      return null;
    }

    return {
      abstract: data.abstract,
      keywords: data.keywords,
      coauthors: data.coauthors,
      affiliations: data.affiliations,
      funding: data.funding,
      acknowledgements: data.acknowledgements,
      originalityScore: data.originality_score
    };
  } catch (error) {
    console.error('Error in getPaperMetadata:', error);
    return null;
  }
};

// Update user profile in Supabase
export const updateUserProfile = async (
  userId: string,
  profileData: {
    fullName?: string;
    institution?: string;
    bio?: string;
    walletAddress?: string;
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileData.fullName,
        institution: profileData.institution,
        bio: profileData.bio,
        wallet_address: profileData.walletAddress,
        updated_at: new Date()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    console.log('User profile updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return false;
  }
};

// Get user profile from Supabase
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};
