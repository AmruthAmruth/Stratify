import React from "react";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  User,
  Award,
  Shield,
  MapPin,
  Clock,
  Building,
  Edit3,
  Settings,
  MoreVertical,
  Star,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  position: string;
  companyId: string;
  departmentId?: string;
  departmentName?: string;
  profileImage?: string;
  dob: Date;
  gender?: string;
  joiningDate: Date;
  experience?: number;
  age?: number;
}

const ProfilePage: React.FC = () => {
  // Enhanced dummy data
  const profile: Profile = {
    id: "EMP12345",
    name: "Anushka Sharma",
    email: "anushka.sharma@company.com",
    phone: "+91 98765 43214",
    role: "Manager",
    position: "Senior Project Manager",
    companyId: "COMP001",
    departmentId: "D001",
    departmentName: "Technology",
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    dob: new Date("1990-07-21"),
    gender: "Female",
    joiningDate: new Date("2015-03-15"),
    experience: 10,
    age: 34,
  };

  const stats = [
    { label: "Projects Completed", value: "47", icon: FileText, color: "text-emerald-600 bg-emerald-50" },
    { label: "Team Size", value: "12", icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Performance", value: "4.8", icon: Star, color: "text-amber-600 bg-amber-50" },
    { label: "Growth Rate", value: "+23%", icon: TrendingUp, color: "text-purple-600 bg-purple-50" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden mb-8">
          <div className="relative">
            {/* Cover Background */}
            <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200">
                  <Edit3 className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200">
                  <Settings className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200">
                  <MoreVertical className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="relative px-6 sm:px-8 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                {/* Profile Image */}
                <div className="-mt-16 sm:-mt-20">
                  <div className="relative">
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white"></div>
                  </div>
                </div>
                
                {/* Basic Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        {profile.name}
                      </h1>
                      <p className="text-lg text-gray-600 mb-2">{profile.position}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                          <Shield className="w-3 h-3 mr-1" />
                          {profile.role}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
                          <Building className="w-3 h-3 mr-1" />
                          {profile.departmentName}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-700 rounded-full">
                          <Clock className="w-3 h-3 mr-1" />
                          {profile.experience}+ years
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                        Message
                      </button>
                      <button className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200">
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h2>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                        <p className="font-semibold text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors duration-200">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                        <p className="font-semibold text-gray-900">{profile.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Date of Birth</p>
                        <p className="font-semibold text-gray-900">{profile.dob.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors duration-200">
                        <User className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Gender</p>
                        <p className="font-semibold text-gray-900">{profile.gender || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Work Information
                </h2>
              </div>
              
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Position</p>
                        <p className="font-semibold text-gray-900">{profile.position}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-200">
                        <Award className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Department</p>
                        <p className="font-semibold text-gray-900">{profile.departmentName || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors duration-200">
                        <Shield className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Joining Date</p>
                        <p className="font-semibold text-gray-900">{profile.joiningDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors duration-200">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
                        <p className="font-semibold text-gray-900">{profile.experience} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl hover:bg-blue-50 transition-colors duration-200 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">View Performance</span>
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-emerald-50 transition-colors duration-200 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-gray-700">Schedule Meeting</span>
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-purple-50 transition-colors duration-200 flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-700">View Achievements</span>
                </button>
              </div>
            </div>

            {/* Employee Status */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                  <span className="font-medium text-gray-700">Status</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">Employee ID</span>
                  <span className="font-mono text-gray-900 font-semibold">{profile.id}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="font-medium text-gray-700">Age</span>
                  <span className="text-gray-900 font-semibold">{profile.age} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;