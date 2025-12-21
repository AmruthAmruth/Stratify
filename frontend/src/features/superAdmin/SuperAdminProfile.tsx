import React, { useEffect, useState } from 'react';
import { User, Mail, Camera, Shield } from 'lucide-react';
import { getSuperAdminProfile, updateSuperAdminProfile } from '@/services/superAdmin';
import DynamicForm from '@/shared/components/Forms/DynamicForm';
import { z } from 'zod';
import { enqueueSnackbar } from 'notistack';

interface SuperAdminProfile {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
}

const SuperAdminProfile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<SuperAdminProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'view' | 'edit'>('view');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getSuperAdminProfile();
            setProfile(response);
            if (response.profileImage) {
                setImagePreview(response.profileImage);
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
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('profileImage', file);

            await updateSuperAdminProfile(formData);
            enqueueSnackbar('Profile picture updated successfully!', { variant: 'success' });
            await fetchProfile();
        } catch (err: unknown) {
            const error = err as { message?: string };
            console.error('Error uploading image:', error);
            enqueueSnackbar(error?.message || 'Failed to upload profile picture', { variant: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleProfileUpdate = async (values: Record<string, unknown>) => {
        try {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                formData.append(key, values[key] as string);
            });

            await updateSuperAdminProfile(formData);
            enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
            await fetchProfile();
            setActiveTab('view');
        } catch (err: unknown) {
            const error = err as { message?: string };
            console.error('Error updating profile:', error);
            enqueueSnackbar(error?.message || 'Failed to update profile', { variant: 'error' });
        }
    };

    const editProfileSchema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
    });

    const editProfileFields = [
        { name: 'name', label: 'Full Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
    ];

    const getInitials = (name: string) => {
        return name
            ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'SA';
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
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#3b3b3b] mb-2">My Profile</h1>
                <p className="text-[#3b3b3b]/70">Manage your personal information</p>
            </div>

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
            </div>

            {activeTab === 'view' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-[#dfdcef] rounded-2xl p-8 shadow-sm">
                            <div className="flex flex-col items-center">
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

                                <h2 className="mt-6 text-2xl font-bold text-[#3b3b3b]">{profile.name || 'Super Admin'}</h2>
                                <p className="text-[#3b3b3b]/70 font-medium mt-1">Super Administrator</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
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
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-[#3b3b3b]/50 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-[#3b3b3b]/50 uppercase tracking-wide">Role</p>
                                        <p className="text-[#3b3b3b] font-medium">Super Admin</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default SuperAdminProfile;
