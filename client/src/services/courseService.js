import API from '../api/axios';

const getCourses = async () => {
    const response = await API.get('/courses');
    return response.data;
};

const createCourse = async (courseData) => {
    const response = await API.post('/courses', courseData);
    return response.data;
};

const getCourseById = async (id) => {
    const response = await API.get(`/courses/${id}`);
    return response.data;
};

const enroll = async (courseId) => {
    const response = await API.post(`/courses/${courseId}/enroll`);
    return response.data;
};

const getProgress = async (courseId) => {
    const response = await API.get(`/courses/${courseId}/progress`);
    return response.data;
};

const updateLessonProgress = async (enrollmentId, lessonId) => {
    const response = await API.put(`/progress/${enrollmentId}/lessons/${lessonId}`);
    return response.data;
};

const generateCertificate = async (courseId) => {
    const response = await API.post(`/courses/${courseId}/certificate`);
    return response.data;
};

const courseService = {
    getCourses,
    getCourseById,
    createCourse,
    enroll,
    getProgress,
    updateLessonProgress,
    generateCertificate,
};

export default courseService;
