import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';

const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await courseService.createCourse({ title, description, price, thumbnail });
            navigate('/courses');
        } catch (error) {
            console.error('Failed to create course', error);
            alert('Failed to create course');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Course</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Title</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                    <input
                        type="text"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Create Course
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCourse;
