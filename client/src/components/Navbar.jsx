import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-primary">Pandiyarajan Learning</Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Home
                            </Link>
                            <Link to="/courses" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Courses
                            </Link>
                            {user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                                <Link to="/create-course" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Create Course
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700 text-sm">Hello, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                    Log in
                                </Link>
                                <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
