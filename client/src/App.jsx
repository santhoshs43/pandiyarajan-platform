import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import CreateCourse from './pages/CreateCourse';
import Navbar from './components/Navbar';

function Home() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Online Learning Platform</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Master New Skills Today
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Access high-quality courses from top instructors. Learn at your own pace and advance your career.
          </p>
          <div className="mt-8">
            <Link to="/courses" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-indigo-700">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Courses</h3>
        {/* Placeholder content for now */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center text-gray-500">
            Check out our <Link to="/courses" className="text-primary hover:underline">Courses page</Link> to see real data!
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/create-course" element={<CreateCourse />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
