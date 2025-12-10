import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import courseService from '../services/courseService';
// You might need to install lucide-react or heroicons for icons, fallback to text if not available
// npm install lucide-react

const CourseDetail = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollment, setEnrollment] = useState(null);
    const [progress, setProgress] = useState({}); // Map of lessonId -> boolean (completed)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [maxWatched, setMaxWatched] = useState(0);
    const playerRef = useRef(null);

    // Reset max watched when lesson changes
    useEffect(() => {
        setMaxWatched(0);
    }, [activeLesson]);

    const handleProgress = (state) => {
        const { playedSeconds } = state;

        // If lesson is already completed, allow free seeking
        if (activeLesson && progress[activeLesson.id]) {
            return;
        }

        // Allow seeking back, but not forward beyond maxWatched + buffer
        // Buffer of 2 seconds to allow for small glitches/updates
        if (playedSeconds > maxWatched + 2) {
            // User tried to skip ahead
            if (playerRef.current) {
                playerRef.current.seekTo(maxWatched, 'seconds');
            }
        } else {
            // Valid progress, update maxWatched if needed
            if (playedSeconds > maxWatched) {
                setMaxWatched(playedSeconds);
            }
        }
    };

    const handleGenerateCertificate = async () => {
        try {
            const certData = await courseService.generateCertificate(course.id);
            alert(`Certificate Generated! ID: ${certData.id}`);
            // In a real app, you would redirect to the certificate URL or open a modal
        } catch (error) {
            console.error('Certificate generation failed', error);
            alert('Failed to generate certificate');
        }
    };

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseData = await courseService.getCourseById(id);
                setCourse(courseData);

                if (user && user.role !== 'INSTRUCTOR') {
                    try {
                        // Check progress (wrapper for getting enrollment + progress)
                        // If 404/not enrolled, this might throw or return null
                        const progressData = await courseService.getProgress(id);
                        if (progressData) {
                            setEnrollment(progressData);
                            // Transform progress array to map
                            const progressMap = {};
                            progressData.progress.forEach(p => {
                                if (p.completed) progressMap[p.lessonId] = true;
                            });
                            setProgress(progressMap);
                        }
                    } catch (err) {
                        // Likely not enrolled
                        console.log('User not enrolled or error fetching progress');
                    }
                }

                // Set initial active lesson
                if (courseData.lessons && courseData.lessons.length > 0) {
                    setActiveLesson(courseData.lessons[0]);
                }

            } catch (error) {
                console.error('Failed to fetch course details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, user]);

    const handleEnroll = async () => {
        try {
            const data = await courseService.enroll(id);
            alert('Enrolled successfully! Amount paid: ₹10');
            setEnrollment(data.enrollment);
            window.location.reload(); // Simple reload to refresh state completely
        } catch (error) {
            console.error('Enrollment failed', error);
            alert('Failed to enroll');
        }
    };

    const handleLessonComplete = async () => {
        if (!enrollment || !activeLesson) return;

        try {
            await courseService.updateLessonProgress(enrollment.id, activeLesson.id);

            // Update local state
            const newProgress = { ...progress, [activeLesson.id]: true };
            setProgress(newProgress);

            // Auto-advance or allow user to click next
            // Find next lesson
            // const currentIndex = course.lessons.findIndex(l => l.id === activeLesson.id);
            // if (currentIndex < course.lessons.length - 1) {
            //     setActiveLesson(course.lessons[currentIndex + 1]);
            // }
        } catch (error) {
            console.error('Failed to update progress', error);
        }
    };

    const isLessonLocked = (index) => {
        if (!enrollment) return true; // All locked if not enrolled
        if (index === 0) return false; // First lesson always unlocked if enrolled

        // Check if previous lesson is completed
        const prevLessonId = course.lessons[index - 1].id;
        return !progress[prevLessonId];
    };

    const allLessonsCompleted = () => {
        if (!course || !course.lessons) return false;
        return course.lessons.every(l => progress[l.id]);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (!course) {
        return <div className="text-center py-20 text-2xl font-bold">Course not found</div>;
    }

    const isInstructor = user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN');
    const hasAccess = isInstructor || enrollment?.status === 'ACTIVE';

    // Sort lessons by sequence or id
    const sortedLessons = course.lessons?.sort((a, b) => a.id - b.id) || [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Main Content - Video Player */}
            <div className="flex-1 md:w-3/4 p-6 overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    {!hasAccess ? (
                        <div className="aspect-w-16 aspect-h-9 bg-gray-900 relative flex flex-col items-center justify-center text-white h-[500px]">
                            <h2 className="text-3xl font-bold mb-4">Course Locked</h2>
                            <p className="mb-6 text-gray-300">Enroll to access full course content.</p>
                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                                <p className="text-sm text-gray-400 mb-1">Course Fee</p>
                                <p className="text-4xl font-bold text-green-400 mb-6">₹10</p>
                                <button
                                    onClick={handleEnroll}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-indigo-500/30"
                                >
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-w-16 aspect-h-9 bg-black relative">
                            {activeLesson?.videoUrl ? (
                                <div className="w-full h-[500px]">
                                    <ReactPlayer
                                        ref={playerRef}
                                        url={activeLesson.videoUrl}
                                        width="100%"
                                        height="100%"
                                        controls={true}
                                        onProgress={handleProgress}
                                        onEnded={handleLessonComplete}
                                        progressInterval={1000}
                                        config={{
                                            youtube: {
                                                playerVars: { showinfo: 0, rel: 0, modestbranding: 1 }
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-[500px] flex items-center justify-center bg-gray-900 text-white flex-col">
                                    <span className="text-6xl mb-4">▶️</span>
                                    <p className="text-xl font-medium">Select a lesson to start watching</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{activeLesson?.title || course.title}</h1>
                                <p className="text-gray-600 leading-relaxed mb-6">{activeLesson?.content || course.description}</p>
                            </div>
                            {progress[activeLesson?.id] && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    ✅ Completed
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-4 border-t pt-6">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                                {course.instructor?.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Instructor</p>
                                <p className="text-lg font-bold text-gray-900">{course.instructor?.name}</p>
                            </div>
                        </div>

                        {/* Certificate Section */}
                        {hasAccess && allLessonsCompleted() && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-yellow-800">🎉 Course Completed!</h3>
                                        <p className="text-yellow-700">You have successfully finished all lessons.</p>
                                    </div>
                                    <button
                                        onClick={handleGenerateCertificate}
                                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg shadow-sm transition-colors"
                                    >
                                        Download Certificate
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar - Curriculum */}
            <div className="md:w-1/4 bg-white border-l border-gray-200 h-full min-h-screen">
                <div className="p-6 border-b border-gray-200 bg-indigo-600 text-white">
                    <h2 className="text-xl font-bold">Course Content</h2>
                    <p className="text-indigo-100 text-sm mt-1">{sortedLessons.length} Lessons</p>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                    {sortedLessons.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {sortedLessons.map((lesson, index) => {
                                const isLocked = !isInstructor && isLessonLocked(index);
                                const isCompleted = progress[lesson.id];
                                const isActive = activeLesson?.id === lesson.id;

                                return (
                                    <button
                                        key={lesson.id}
                                        onClick={() => !isLocked && setActiveLesson(lesson)}
                                        disabled={isLocked}
                                        className={`w-full text-left p-4 transition-colors flex items-start gap-4 
                                            ${isActive ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}
                                            ${isLocked ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                                        `}
                                    >
                                        <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs border 
                                            ${isCompleted ? 'bg-green-500 text-white border-green-500' :
                                                isActive ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-500'}
                                        `}>
                                            {isCompleted ? '✓' : index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className={`font-medium text-sm ${isActive ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                    {lesson.title}
                                                </h3>
                                                {isLocked && <span className="text-xs text-gray-400">🔒</span>}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">10 mins</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500 italic">
                            No lessons available yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
