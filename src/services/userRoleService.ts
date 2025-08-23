
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'editor' | 'viewer';

// Check if a user has a specific role
export const hasUserRole = async (role: UserRole): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Include specific admin email alongside the domain check
    if (role === 'admin' && 
        (user.email?.endsWith('@admin.com') || 
         user.email === 'briancheruiyot001@gmail.com')) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

// Check if current user is an admin
export const isUserAdmin = async (): Promise<boolean> => {
  return hasUserRole('admin');
};

// Assign a role to a user
export const assignUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Implementation will be updated once user_roles table is created
    toast.info(`Role ${role} would be assigned to user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error assigning user role:', error);
    toast.error('Failed to assign role');
    return false;
  }
};

// Remove a role from a user
export const removeUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Implementation will be updated once user_roles table is created
    toast.info(`Role ${role} would be removed from user ${userId}`);
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
    // Implementation will be updated once user_roles table is created
    // For now, return a default role based on email domain
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && user.email?.endsWith('@admin.com')) {
      return ['admin'];
    }
    
    return ['viewer'];
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
};
