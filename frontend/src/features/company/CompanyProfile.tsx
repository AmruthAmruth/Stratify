import React, { useEffect, useState } from "react";
import {
    Building,
    Phone,
    MapPin,
    Globe,
    FileText,
    Edit3,
    Save,
    X,
    Camera,
    Briefcase,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getCompanyProfile, updateCompanyProfile } from "@/services/company";
import InfoCard from "@/shared/components/InfoCard/InfoCard";
import { toast } from "react-hot-toast";
import type { Company } from "@/types/types";

const CompanyProfile: React.FC = () => {
    const { userId } = useSelector((state: RootState) => state.auth);
    const [company, setCompany] = useState<Company | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<Company>>({});
    const [loading, setLoading] = useState(true);

    const fetchCompanyProfile = React.useCallback(async () => {
        try {
            setLoading(true);
            // Assuming getCompanyProfile takes ID. If user is company, user.id is companyId.
            const response = await getCompanyProfile(userId!);
            setCompany(response);
            setFormData(response);
        } catch (error) {
            console.error("Error fetching company profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchCompanyProfile();
        }
    }, [userId, fetchCompanyProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedCompany = await updateCompanyProfile(formData);
            setCompany(updatedCompany);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        setFormData(company || {});
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Profile not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-10"></div>

                    {/* Logo */}
                    <div className="flex-shrink-0 relative z-10">
                        <div className="w-32 h-32 rounded-2xl bg-white shadow-md flex items-center justify-center border-4 border-white overflow-hidden">
                            {company.profileImage ? (
                                <img
                                    src={company.profileImage}
                                    alt={company.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building className="w-16 h-16 text-blue-600" />
                            )}
                        </div>
                        {isEditing && (
                            <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-blue-600 transition">
                                <Camera className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center gap-2 z-10 text-center lg:text-left">
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleInputChange}
                                className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                                placeholder="Company Name"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                        )}

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-600">
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="industry"
                                        value={formData.industry || ""}
                                        onChange={handleInputChange}
                                        className="border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                                        placeholder="Industry"
                                    />
                                ) : (
                                    company.industry
                                )}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {company.city}, {company.country}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 z-10">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                                >
                                    <Save className="w-4 h-4" /> Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
                            >
                                <Edit3 className="w-4 h-4" /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Contact & Address */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-600" /> Contact Info
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{company.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{company.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Website</label>
                                    <p className="text-blue-600 font-medium hover:underline cursor-pointer">www.{company.name.toLowerCase().replace(/\s/g, '')}.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" /> Address
                            </h3>
                            <div className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address || ""}
                                            onChange={handleInputChange}
                                            placeholder="Street Address"
                                            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city || ""}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state || ""}
                                                onChange={handleInputChange}
                                                placeholder="State"
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country || ""}
                                                onChange={handleInputChange}
                                                placeholder="Country"
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                            <input
                                                type="text"
                                                name="zipcode"
                                                value={formData.zipcode || ""}
                                                onChange={handleInputChange}
                                                placeholder="Zipcode"
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-900">{company.address}</p>
                                        <p className="text-gray-900">{company.city}, {company.state}</p>
                                        <p className="text-gray-900">{company.country} - {company.zipcode}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: About & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-purple-600" /> About Company
                            </h3>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe your company..."
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {company.description || "No description available."}
                                </p>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Globe className="w-6 h-6 text-orange-600" /> Business Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard
                                    icon={<Briefcase className="w-5 h-5 text-blue-600" />}
                                    label="Business Registration No"
                                    value={
                                        isEditing ? (
                                            <input
                                                type="text"
                                                name="businessRegNo"
                                                value={formData.businessRegNo || ""}
                                                onChange={handleInputChange}
                                                className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                                            />
                                        ) : (
                                            company.businessRegNo
                                        )
                                    }
                                    bgColor="bg-blue-50"
                                    hoverColor="hover:bg-blue-100"
                                />
                                <InfoCard
                                    icon={<Building className="w-5 h-5 text-indigo-600" />}
                                    label="Company ID"
                                    value={company.id}
                                    bgColor="bg-indigo-50"
                                    hoverColor="hover:bg-indigo-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
