import { useState, useEffect } from 'react';
import courseService from '../services/courseService';
import { Link } from 'react-router-dom';

const Courses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getCourses();
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
                {/* TODO: Check if user is instructor to show this button */}
                <Link
                    to="/create-course"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Create Course
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <div className="h-48 bg-gray-200 w-full object-cover relative">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="px-4 py-5 sm:p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{course.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-primary font-bold text-lg">${course.price}</span>
                                <span className="text-sm text-gray-500">By {course.instructor?.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
