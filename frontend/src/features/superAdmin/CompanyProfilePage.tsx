import React, { useEffect, useState } from "react";
import {
  Edit3,
  Mail,
  Phone,
  MapPin,
  Globe,
  Building2,
  Hash,
  CheckCircle,
} from "lucide-react";
import InfoCard from "@/shared/components/InfoCard/InfoCard";
import { getCompanyProfile } from "@/services/company";
import { useParams } from "react-router-dom";

interface CompanyDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  description: string;
  businessRegNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  password: string;
  status: "pending" | "active" | "inactive" | string;
  role: "company";
  profileImage?: string;
}

const CompanyProfilePage = () => {
  const userRole = "company"; // renamed to avoid shadowing
  const { id } = useParams<{ id: string }>();
  const [companyData, setCompanyData] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getCompanyProfile(id)
      .then((data) => {
        // Data comes directly from the API response
        setCompanyData(data as unknown as CompanyDetails);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching company profile:", err);
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading company profile...</p>
      </div>
    );
  }

  // Handle case where no data is returned
  if (!companyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg">Company profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6 mb-8 lg:mb-0">
              <div className="relative">
                <img
                  src={
                    companyData.profileImage ||
                    "https://via.placeholder.com/150?text=No+Logo"
                  }
                  alt="Company Logo"
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary w-6 h-6 rounded-full border-3 border-white flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {companyData.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    {companyData.industry}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {companyData.city}, {companyData.state}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {companyData.status}
                  </span>
                </div>
              </div>
            </div>

            {userRole === "company" && (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              About Company
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {companyData.description}
            </p>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon={<MapPin />}
              label="Street Address"
              value={companyData.address}
              bgColor="bg-blue-100"
            />
            <InfoCard
              icon={<MapPin />}
              label="City"
              value={companyData.city}
              bgColor="bg-blue-100"
            />
            <InfoCard
              icon={<MapPin />}
              label="State"
              value={companyData.state}
              bgColor="bg-blue-100"
            />
            <InfoCard
              icon={<MapPin />}
              label="ZIP Code"
              value={companyData.zipcode}
              bgColor="bg-blue-100"
            />
            <InfoCard
              icon={<Globe />}
              label="Country"
              value={companyData.country}
              bgColor="bg-blue-100"
            />
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-2xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon={<Hash />}
              label="Business Reg. No"
              value={companyData.businessRegNo}
              bgColor="bg-green-100"
            />
            <InfoCard
              icon={<CheckCircle />}
              label="Status"
              value={companyData.status}
              bgColor="bg-green-100"
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Information
            </h3>
            <InfoCard
              icon={<Mail />}
              label="Email"
              value={companyData.email}
              bgColor="bg-blue-100"
            />
            <InfoCard
              icon={<Phone />}
              label="Phone"
              value={companyData.phone}
              bgColor="bg-green-100"
            />
            <InfoCard
              icon={<Globe />}
              label="Industry"
              value={companyData.industry}
              bgColor="bg-purple-100"
            />
          </div>

          {/* Company Stats */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Company Overview
            </h3>
            <div className="divide-y divide-gray-200">
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-sm ${companyData.status === "active"
                      ? "bg-green-100 text-primaryHover"
                      : companyData.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                >
                  {companyData.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Industry</span>
                <span className="font-medium text-gray-900">
                  {companyData.industry}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-gray-900 text-right">
                  {companyData.city}, {companyData.state}
                </span>
              </div>
            </div>
          </div>




        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
