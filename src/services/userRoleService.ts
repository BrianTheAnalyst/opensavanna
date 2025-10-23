
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserRole = 'admin' | 'moderator' | 'user';

// Check if a user has a specific role using the database
export const hasUserRole = async (role: UserRole): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Query the user_roles table to check if user has the role
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', role)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

// Check if current user is an admin
export const isUserAdmin = async (): Promise<boolean> => {
  return hasUserRole('admin');
};

// Assign a role to a user (admin only)
export const assignUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });
    
    if (error) {
      console.error('Error assigning user role:', error);
      toast.error('Failed to assign role');
      return false;
    }
    
    toast.success(`Role ${role} assigned successfully`);
    return true;
  } catch (error) {
    console.error('Error assigning user role:', error);
    toast.error('Failed to assign role');
    return false;
  }
};

// Remove a role from a user (admin only)
export const removeUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    if (error) {
      console.error('Error removing user role:', error);
      toast.error('Failed to remove role');
      return false;
    }
    
    toast.success(`Role ${role} removed successfully`);
    return true;
  } catch (error) {
    console.error('Error removing user role:', error);
    toast.error('Failed to remove role');
    return false;
  }
};

// Get all roles for a user
export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error getting user roles:', error);
      return [];
    }
    
    return data?.map(r => r.role as UserRole) || [];
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
};
