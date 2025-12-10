import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/courseService';

const InstructorDashboard = () => {
    const [myCourses, setMyCourses] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCourses = await courseService.getCourses();
                // Filter courses where the instructorId matches the current user's ID
                // Note: user.id might be string or int, so loose comparison is safer or ensure types
                const filtered = allCourses.filter(course => course.instructorId === user.id);
                setMyCourses(filtered);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            }
        };

        if (user) {
            fetchCourses();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Instructor Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage your courses and content.</p>
                    </div>
                    <Link
                        to="/create-course"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700"
                    >
                        Create New Course
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {myCourses.length > 0 ? (
                            myCourses.map((course) => (
                                <li key={course.id}>
                                    <div className="px-4 py-4 flex items-center sm:px-6">
                                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="flex items-center justify-center h-full text-gray-400 text-xs">No Img</span>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-primary truncate">{course.title}</div>
                                                    <div className="flex mt-1">
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            {course.lessons?.length || 0} Lessons
                                                        </p>
                                                        <p className="ml-4 flex items-center text-sm text-gray-500">
                                                            ${course.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                                                <div className="flex space-x-2">
                                                    <Link to={`/courses/${course.id}`} className="text-gray-400 hover:text-gray-500">
                                                        View
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-12 text-center text-gray-500">
                                You haven't created any courses yet.
                            </li>
                        )}
                    </ul>
                </div>

                {/* Stats Section Placeholder */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">$0.00</dd>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
