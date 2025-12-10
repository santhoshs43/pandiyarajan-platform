import API from '../api/axios';

const getCourses = async () => {
    const response = await API.get('/courses');
    return response.data;
};

const createCourse = async (courseData) => {
    const response = await API.post('/courses', courseData);
    return response.data;
};

const courseService = {
    getCourses,
    createCourse,
};

export default courseService;
