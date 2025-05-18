import { AppContext } from '@/context/AppContext'
import { Bell, ChevronDown, User, School } from 'lucide-react'
import { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingOverlay from './ui/loading_screen';
import { logout } from '@/feature/authentication/service/auth';
import { AxiosError } from 'axios';


const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const { token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await logout(token);
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

    <header className="w-full h-16 bg-white  flex items-center justify-between px-6">
      {loading &&
        <LoadingOverlay
        />}
      <div className="flex items-center space-x-3">
        <School className="w-8 h-8 text-green-600" />
        <h1 className="text-xl font-bold">Sistem Manajemen Sekolah</h1>
      </div>

      {/* Kanan: Notifikasi dan User */}
      <div className="flex items-center space-x-6 relative">
        {/* Notifikasi */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-800" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            2
          </span>
        </div>

        {/* User */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center space-x-1 cursor-pointer"
            onClick={toggleDropdown}
          >
            <User className="w-5 h-5 text-gray-800" />
            <span>User</span>
            <ChevronDown className="w-4 h-4" />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm rounded-md"
                onClick={() => {
                  toggleDropdown();
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
