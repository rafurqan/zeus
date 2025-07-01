import { AppContext } from '@/context/AppContext'
import { Bell, ChevronDown, User, School } from 'lucide-react'
import { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from './ui/loading_screen';
import { logout } from '@/feature/authentication/service/auth';
import { AxiosError } from 'axios';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [local, setLocal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const { setUser, setToken, setLoading } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // setLocal(true);
      setLoading(true);
      const response = await logout();
      setToken(response.data.access_token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // Jika error berasal dari Axios, kita bisa akses err.response dan err.message
      } else {
        // Error bukan dari Axios, tangani sesuai kebutuhan
      }
    } finally {
      setUser(null);
      setToken(null);
      setLocal(false);
      setLoading(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      {local && <LoadingOverlay />}

      {/* Left: Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
          <School className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Sistem Manajemen Sekolah</h1>
      </div>

      {/* Right: Notifications and User */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors group">
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
            2
          </span>
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-sm group"
            onClick={toggleDropdown}
          >
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">User</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="py-2">
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
                  onClick={() => {
                    toggleDropdown();
                    handleLogout();
                  }}
                >
                  <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16,17 21,12 16,7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </div>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;