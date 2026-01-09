import React, { useEffect, useState } from "react";
import {
    Building,
    Phone,
    MapPin,
    FileText,
    Edit3,
    Briefcase,
    Palette,
    Mail,
    Globe,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { getCompanyProfile, updateCompanyProfile } from "@/services/company";
import InfoCard from "@/shared/components/InfoCard/InfoCard";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import DynamicForm from "@/shared/components/Forms/DynamicForm";
import { updateCompanyProfileFields } from "@/shared/components/Forms/formFields";
import { toast } from "react-hot-toast";
import type { Company } from "@/types/types";
import { z } from "zod";

// Validation schema for company profile update
const companyProfileSchema = z.object({
    name: z.string().min(1, "Company name is required"),
    industry: z.string().min(1, "Industry is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipcode: z.string().min(1, "Zip code is required"),
    description: z.string().optional(),
    businessRegNo: z.string().min(1, "Business registration number is required"),
});

const CompanyProfile: React.FC = () => {
    const { userId } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [company, setCompany] = useState<Company | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const fetchCompanyProfile = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await getCompanyProfile(userId!);
            setCompany(response);
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

    const handleUpdateProfile = async (values: unknown) => {
        setSubmitLoading(true);
        try {
            const updatedCompany = await updateCompanyProfile(values as Record<string, unknown>);
            setCompany(updatedCompany);
            setIsEditModalOpen(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted">
                Profile not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Card */}
                <div className="bg-surface rounded-2xl shadow-lg border border-borderColor p-8 mb-8 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/10 to-primary/5"></div>

                    {/* Logo */}
                    <div className="flex-shrink-0 relative z-10">
                        <div className="w-32 h-32 rounded-2xl bg-surface shadow-md flex items-center justify-center border-4 border-surface overflow-hidden">
                            {company.profileImage ? (
                                <img
                                    src={company.profileImage}
                                    alt={company.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Building className="w-16 h-16 text-primary" />
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center gap-2 z-10 text-center lg:text-left">
                        <h1 className="text-4xl font-bold text-heading">{company.name}</h1>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-text">
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4 text-primary" />
                                {company.industry}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-primary" />
                                {company.city}, {company.country}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 z-10">
                        <button
                            onClick={() => navigate('/theme-settings')}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-textOnPrimary rounded-xl hover:bg-primaryHover transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                        >
                            <Palette className="w-4 h-4" /> Theme
                        </button>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-surface text-text border-2 border-borderColor rounded-xl hover:bg-accent transition-all duration-200 shadow-sm font-semibold"
                        >
                            <Edit3 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Contact & Address */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-surface rounded-2xl shadow-sm border border-borderColor p-6">
                            <h3 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-primary" /> Contact Info
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">Email</label>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-primary" />
                                        <p className="text-heading font-medium">{company.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">Phone</label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <p className="text-heading font-medium">{company.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-1">Website</label>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-primary" />
                                        <p className="text-primary font-medium hover:underline cursor-pointer">
                                            www.{company.name.toLowerCase().replace(/\s/g, '')}.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface rounded-2xl shadow-sm border border-borderColor p-6">
                            <h3 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" /> Address
                            </h3>
                            <div className="space-y-2">
                                <p className="text-heading">{company.address}</p>
                                <p className="text-heading">{company.city}, {company.state}</p>
                                <p className="text-heading">{company.country} - {company.zipcode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: About & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-surface rounded-2xl shadow-sm border border-borderColor p-8">
                            <h3 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-primary" /> About Company
                            </h3>
                            <p className="text-text leading-relaxed text-lg">
                                {company.description || "No description available."}
                            </p>
                        </div>

                        <div className="bg-surface rounded-2xl shadow-sm border border-borderColor p-8">
                            <h3 className="text-xl font-bold text-heading mb-6 flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-primary" /> Business Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoCard
                                    icon={<Briefcase className="w-5 h-5 text-primary" />}
                                    label="Business Registration No"
                                    value={company.businessRegNo}
                                    bgColor="bg-primary/10"
                                    hoverColor="hover:bg-primary/20"
                                />
                                <InfoCard
                                    icon={<Building className="w-5 h-5 text-primary" />}
                                    label="Company ID"
                                    value={company.id}
                                    bgColor="bg-primary/10"
                                    hoverColor="hover:bg-primary/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Company Profile"
            >
                <DynamicForm
                    fields={updateCompanyProfileFields}
                    validationSchema={companyProfileSchema}
                    onSubmit={handleUpdateProfile}
                    buttonText={submitLoading ? "Updating..." : "Update Profile"}
                    loading={submitLoading}
                    initialValues={company}
                />
            </Modal>
        </div>
    );
};

export default CompanyProfile;
