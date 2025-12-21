import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Building2, Shield, Camera } from 'lucide-react';
import { getManagerProfile, updateManagerProfile, changeManagerPassword } from '@/services/authApi';
import DynamicForm from '@/shared/components/Forms/DynamicForm';
import { z } from 'zod';
import { enqueueSnackbar } from 'notistack';

interface ManagerProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    profileImage?: string;
    department?: {
        id: string;
        name: string;
    };
    role: string;
    employeeId?: string;
    joinDate?: string;
    projectsManaged?: number;
    teamSize?: number;
}

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ManagerProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'password'>('view');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response: { manager?: ManagerProfile; profileImage?: string } & ManagerProfile = await getManagerProfile();
            setProfile(response.manager || response);
            if (response.manager?.profileImage || response.profileImage) {
                setImagePreview(response.manager?.profileImage || response.profileImage);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            enqueueSnackbar('Failed to load profile', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            enqueueSnackbar('Please upload an image file', { variant: 'error' });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            enqueueSnackbar('Image size should be less than 5MB', { variant: 'error' });
            return;
        }

        try {
            setUploading(true);

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload image
            await updateManagerProfile({ profileImage: file });
            enqueueSnackbar('Profile picture updated successfully!', { variant: 'success' });
            await fetchProfile();
        } catch (error) {
            const err = error as { message?: string };
            console.error('Error uploading image:', error);
            enqueueSnackbar(err?.message || 'Failed to upload profile picture', { variant: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async (values: Record<string, unknown>) => {
        try {
            await updateManagerProfile(values);
            enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
            await fetchProfile();
            setActiveTab('view');
        } catch (error) {
            const err = error as { message?: string };
            console.error('Error updating profile:', error);
            enqueueSnackbar(err?.message || 'Failed to update profile', { variant: 'error' });
        }
    };

    const handlePasswordChange = async (values: Record<string, unknown>) => {
        try {
            await changeManagerPassword({
                currentPassword: values.currentPassword as string,
                newPassword: values.newPassword as string,
            });
            enqueueSnackbar('Password changed successfully!', { variant: 'success' });
            setActiveTab('view');
        } catch (error) {
            const err = error as { message?: string };
            console.error('Error changing password:', error);
            enqueueSnackbar(err?.message || 'Failed to change password', { variant: 'error' });
        }
    };

    // Edit Profile Form Schema
    const editProfileSchema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        phone: z.string().optional(),
        address: z.string().optional(),
        dateOfBirth: z.string().optional(),
    });

    // Change Password Form Schema
    const changePasswordSchema = z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string(),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

    const editProfileFields = [
        { name: 'name', label: 'Full Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone Number', type: 'tel' },
        { name: 'address', label: 'Address', type: 'textarea' },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
    ];

    const changePasswordFields = [
        { name: 'currentPassword', label: 'Current Password', type: 'password' },
        { name: 'newPassword', label: 'New Password', type: 'password' },
        { name: 'confirmPassword', label: 'Confirm New Password', type: 'password' },
    ];

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fbfbfb]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009063]"></div>
                    <p className="mt-4 text-[#3b3b3b] font-medium">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fbfbfb]">
                <p className="text-[#3b3b3b]">Profile not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbfbfb] p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#3b3b3b] mb-2">My Profile</h1>
                <p className="text-[#3b3b3b]/70">Manage your personal information and settings</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-[#dfdcef]">
                <button
                    onClick={() => setActiveTab('view')}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'view'
                        ? 'text-[#009063] border-b-2 border-[#009063]'
                        : 'text-[#3b3b3b]/60 hover:text-[#3b3b3b]'
                        }`}
                >
                    View Profile
                </button>
                <button
                    onClick={() => setActiveTab('edit')}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'edit'
                        ? 'text-[#009063] border-b-2 border-[#009063]'
                        : 'text-[#3b3b3b]/60 hover:text-[#3b3b3b]'
                        }`}
                >
                    Edit Profile
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'password'
                        ? 'text-[#009063] border-b-2 border-[#009063]'
                        : 'text-[#3b3b3b]/60 hover:text-[#3b3b3b]'
                        }`}
                >
                    Change Password
                </button>
            </div>

            {/* View Profile Tab */}
            {activeTab === 'view' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[#dfdcef] rounded-2xl p-8 shadow-sm">
                            <div className="flex flex-col items-center">
                                {/* Avatar */}
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#009063] to-[#007a52] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt={profile.name} className="w-full h-full object-cover" />
                                        ) : (
                                            getInitials(profile.name)
                                        )}
                                    </div>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute bottom-0 right-0 bg-[#009063] text-white p-2 rounded-full cursor-pointer hover:bg-[#007a52] transition shadow-lg"
                                    >
                                        <Camera className="w-5 h-5" />
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Name and Role */}
                                <h2 className="mt-6 text-2xl font-bold text-[#3b3b3b]">{profile.name}</h2>
                                <p className="text-[#3b3b3b]/70 font-medium mt-1">{profile.role || 'Manager'}</p>
                                {profile.employeeId && (
                                    <p className="text-sm text-[#3b3b3b]/50 mt-1">ID: {profile.employeeId}</p>
                                )}

                                {/* Quick Stats */}
                                <div className="w-full mt-6 pt-6 border-t border-[#dfdcef]">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-[#009063]">{profile.projectsManaged || 0}</p>
                                            <p className="text-xs text-[#3b3b3b]/60 mt-1">Projects</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-[#009063]">{profile.teamSize || 0}</p>
                                            <p className="text-xs text-[#3b3b3b]/60 mt-1">Team Members</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-[#3b3b3b] mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-[#009063]" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-[#3b3b3b]/50 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-[#3b3b3b]/50 uppercase tracking-wide">Email</p>
                                        <p className="text-[#3b3b3b] font-medium">{profile.email}</p>
                                    </div>
                                </div>
                                {profile.phone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-[#3b3b3b]/50 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-[#3b3b3b]/50 uppercase tracking-wide">Phone</p>
                                            <p className="text-[#3b3b3b] font-medium">{profile.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {profile.dateOfBirth && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-[#3b3b3b]/50 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-[#3b3b3b]/50 uppercase tracking-wide">Date of Birth</p>
                                            <p className="text-[#3b3b3b] font-medium">
                                                {new Date(profile.dateOfBirth).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {profile.address && (
                                    <div className="flex items-start gap-3 md:col-span-2">
                                        <MapPin className="w-5 h-5 text-[#3b3b3b]/50 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-[#3b3b3b]/50 uppercase tracking-wide">Address</p>
                                            <p className="text-[#3b3b3b] font-medium">{profile.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-[#3b3b3b] mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#009063]" />
                                Professional Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.department && (
                                    <div className="flex items-start gap-3">
                                        <Building2 className="w-5 h-5 text-[#3b3b3b]/50 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-[#3b3b3b]/50 uppercase tracking-wide">Department</p>
                                            <p className="text-[#3b3b3b] font-medium">{profile.department.name}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-[#3b3b3b]/50 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-[#3b3b3b]/50 uppercase tracking-wide">Role</p>
                                        <p className="text-[#3b3b3b] font-medium">{profile.role || 'Manager'}</p>
                                    </div>
                                </div>
                                {profile.joinDate && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-[#3b3b3b]/50 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-[#3b3b3b]/50 uppercase tracking-wide">Join Date</p>
                                            <p className="text-[#3b3b3b] font-medium">
                                                {new Date(profile.joinDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === 'edit' && (
                <div className="max-w-4xl mx-auto">
                    <DynamicForm
                        fields={editProfileFields}
                        validationSchema={editProfileSchema}
                        onSubmit={handleProfileUpdate}
                        buttonText="Update Profile"
                        initialValues={{
                            name: profile.name,
                            email: profile.email,
                            phone: profile.phone || '',
                            address: profile.address || '',
                            dateOfBirth: profile.dateOfBirth || '',
                        }}
                    />
                </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white border border-[#dfdcef] rounded-2xl p-6 mb-6">
                        <h3 className="text-lg font-semibold text-[#3b3b3b] mb-3">Password Requirements:</h3>
                        <ul className="space-y-2 text-sm text-[#3b3b3b]/70">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#009063]"></span>
                                At least 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#009063]"></span>
                                Contains at least one uppercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#009063]"></span>
                                Contains at least one lowercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#009063]"></span>
                                Contains at least one number
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#009063]"></span>
                                Contains at least one special character
                            </li>
                        </ul>
                    </div>
                    <DynamicForm
                        fields={changePasswordFields}
                        validationSchema={changePasswordSchema}
                        onSubmit={handlePasswordChange}
                        buttonText="Change Password"
                    />
                </div>
            )}
        </div>
    );
};

export default Profile;
