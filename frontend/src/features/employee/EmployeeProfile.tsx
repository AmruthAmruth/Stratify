import React, { useEffect, useState } from "react";
import {
    Building,
    Mail,
    Phone,
    MapPin,
    User,
    Edit3,
    Save,
    X,
    Camera,
    Briefcase,
    Calendar,
    Shield,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getEmployeeProfile, updateEmployeeProfile } from "@/services/employee";
import InfoCard from "@/shared/components/InfoCard/InfoCard";
import { toast } from "react-hot-toast";

import type { UserProfile } from "@/types/types";

const EmployeeProfile: React.FC = () => {
    const { userId } = useSelector((state: RootState) => state.auth);
    const [employee, setEmployee] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchEmployeeProfile();
        }
    }, [userId]);

    const fetchEmployeeProfile = async () => {
        try {
            setLoading(true);
            const response = await getEmployeeProfile();
            setEmployee(response);
            setFormData(response);
        } catch (error) {
            console.error("Error fetching employee profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const updatedEmployee = await updateEmployeeProfile(formData);
            setEmployee(updatedEmployee);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        setFormData(employee || {});
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading profile...
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Profile not found.
            </div>
        );
    }

    const departmentName = typeof employee?.departmentId === 'object' ? employee.departmentId.name : 'N/A';

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-600 to-emerald-700 opacity-10"></div>

                    {/* Logo */}
                    <div className="flex-shrink-0 relative z-10">
                        <div className="w-32 h-32 rounded-full bg-white shadow-md flex items-center justify-center border-4 border-white overflow-hidden">
                            {employee.profileImage ? (
                                <img
                                    src={employee.profileImage}
                                    alt={employee.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-green-600 transition">
                                <Camera className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center gap-2 z-10 text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">{employee?.name}</h1>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-600">
                            <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {employee?.position}
                            </span>
                            <span className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {departmentName}
                            </span>
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                <Shield className="w-3 h-3 mr-1" />
                                {employee?.role}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 z-10">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" /> Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                    <p className="text-gray-900 font-medium">{employee?.email}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium">{employee?.phone}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date of Birth</label>
                                        <p className="text-gray-900 font-medium">{employee?.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Gender</label>
                                        <p className="text-gray-900 font-medium capitalize">{employee?.gender || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment Info */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-purple-600" /> Employment Details
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoCard
                                        icon={<Calendar className="w-5 h-5 text-orange-600" />}
                                        label="Joining Date"
                                        value={employee?.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
                                        bgColor="bg-orange-50"
                                        hoverColor="hover:bg-orange-100"
                                    />
                                    <InfoCard
                                        icon={<Shield className="w-5 h-5 text-indigo-600" />}
                                        label="Employee ID"
                                        value={employee?.id?.substring(0, 8).toUpperCase() || 'N/A'}
                                        bgColor="bg-indigo-50"
                                        hoverColor="hover:bg-indigo-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Department</label>
                                    <p className="text-gray-900 font-medium">{departmentName}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Position</label>
                                    <p className="text-gray-900 font-medium">{employee.position}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
