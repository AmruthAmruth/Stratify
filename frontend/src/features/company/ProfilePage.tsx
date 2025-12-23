import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  User,
  Shield,
  Clock,
  Building,
  Edit3,
  ArrowLeft,
  MessageCircle,
  Camera,
  BarChart3,
  FolderKanban,
} from "lucide-react";
import { useParams } from "react-router-dom";
import InfoCard from "@/shared/components/InfoCard/InfoCard";
import { getTeamMemberProfile } from "@/services/company";
import type { UserProfile } from "@/types/types";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      getTeamMemberProfile(id)
        .then((data) => {
          setProfile(data);
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [id]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  const dob = profile.dob ? new Date(profile.dob) : null;
  const joiningDate = profile.joiningDate ? new Date(profile.joiningDate) : null;

  const handleBackToEmployees = () => console.log("Navigate back to employees");
  const handleMessage = () => console.log("Message employee");
  const handleEditProfile = () => console.log("Edit profile");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToEmployees}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Team
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Profile</h1>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 flex flex-col lg:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0 relative">
            <img
              src={profile.profileImage || "/default-avatar.png"}
              alt={profile.name || "Employee"}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
            <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 flex flex-col justify-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900">{profile.name || "N/A"}</h2>
            <p className="text-lg text-gray-600">{profile.position || "N/A"}</p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4 mr-1" /> {profile.role || "N/A"}
              </span>
              <span className="flex items-center px-3 py-1 bg-green-100 text-primaryHover rounded-full text-sm font-medium">
                <Building className="w-4 h-4 mr-1" /> {profile.departmentName || "N/A"}
              </span>
              <span className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4 mr-1" /> {profile.experience ?? 0}+ yrs
              </span>
              <span className="flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Active
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">

              <div className="text-center p-4 bg-gray-50 rounded-xl shadow-sm">
                <div className="text-gray-500 text-sm">Age</div>
                <div className="text-gray-900 font-semibold">{profile.age ?? "N/A"} yrs</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl shadow-sm">
                <div className="text-gray-500 text-sm">Experience</div>
                <div className="text-gray-900 font-semibold">{profile.experience ?? 0} yrs</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl shadow-sm">
                <div className="text-gray-500 text-sm">Status</div>
                <div className="text-primary font-semibold">Active</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 lg:mt-0">
            <button
              onClick={handleMessage}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
            >
              <MessageCircle className="w-5 h-5" />
              Message
            </button>
            <button
              onClick={handleEditProfile}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:bg-gray-50 transition"
            >
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0">
              {["overview", "performance", "projects"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-8 font-semibold text-sm transition-all duration-200 relative ${activeTab === tab
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {tab === "overview" && "Complete Overview"}
                  {tab === "performance" && "Performance"}
                  {tab === "projects" && "Projects"}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Employee Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Email */}
                  <InfoCard
                    icon={<Mail className="w-6 h-6 text-blue-600" />}
                    label="Email Address"
                    value={profile.email}
                    bgColor="bg-blue-100"
                    hoverColor="group-hover:bg-blue-200"
                  />

                  {/* Phone */}
                  <InfoCard
                    icon={<Phone className="w-6 h-6 text-primary" />}
                    label="Phone Number"
                    value={profile.phone}
                    bgColor="bg-green-100"
                    hoverColor="group-hover:bg-green-200"
                  />

                  {/* Position */}
                  <InfoCard
                    icon={<Briefcase className="w-6 h-6 text-purple-600" />}
                    label="Position"
                    value={profile.position}
                    bgColor="bg-purple-100"
                    hoverColor="group-hover:bg-purple-200"
                  />

                  {/* Role */}
                  <InfoCard
                    icon={<Shield className="w-6 h-6 text-indigo-600" />}
                    label="Role"
                    value={profile.role}
                    bgColor="bg-indigo-100"
                    hoverColor="group-hover:bg-indigo-200"
                  />

                  {/* Department */}
                  <InfoCard
                    icon={<Building className="w-6 h-6 text-primary" />}
                    label="Department"
                    value={profile.departmentName || "N/A"}
                    bgColor="bg-primary/10"
                    hoverColor="group-hover:bg-primary/20"
                  />

                  {/* DOB */}
                  <InfoCard
                    icon={<Calendar className="w-6 h-6 text-pink-600" />}
                    label="Date of Birth"
                    value={dob ? dob.toLocaleDateString() : "N/A"}
                    bgColor="bg-pink-100"
                    hoverColor="group-hover:bg-pink-200"
                  />

                  {/* Gender */}
                  <InfoCard
                    icon={<User className="w-6 h-6 text-rose-600" />}
                    label="Gender"
                    value={profile.gender || "N/A"}
                    bgColor="bg-rose-100"
                    hoverColor="group-hover:bg-rose-200"
                  />

                  {/* Joining Date */}
                  <InfoCard
                    icon={<Calendar className="w-6 h-6 text-orange-600" />}
                    label="Joining Date"
                    value={joiningDate ? joiningDate.toLocaleDateString() : "N/A"}
                    bgColor="bg-orange-100"
                    hoverColor="group-hover:bg-orange-200"
                  />

                  {/* Company ID */}
                  <InfoCard
                    icon={<Building className="w-6 h-6 text-gray-600" />}
                    label="Company ID"
                    value={profile.companyId}
                    bgColor="bg-gray-100"
                    hoverColor="group-hover:bg-gray-200"
                  />
                </div>
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === "performance" && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Performance & Analytics</h3>
                <p className="text-gray-600 mb-6">
                  This section will show performance metrics, reviews, and achievements.
                </p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8">
                  <p className="text-gray-500">
                    Coming Soon - Performance tracking and analytics will be available here.
                  </p>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderKanban className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Projects & Tasks</h3>
                <p className="text-gray-600 mb-6">
                  This section will display assigned projects, tasks, and work assignments.
                </p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8">
                  <p className="text-gray-500">
                    Coming Soon - Project assignments and task management will be available here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;
