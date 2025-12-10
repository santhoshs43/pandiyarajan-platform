import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CreateCourse from './pages/CreateCourse';
import InstructorDashboard from './pages/InstructorDashboard';
import Navbar from './components/Navbar';

function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Master New Skills with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary">
              Pandiyarajan Platform
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mb-10">
            Unlock your potential with our expert-led courses. Whether you're looking to advance your career or explore a new hobby, we have the right course for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/courses" className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300">
              Browse All Courses
            </Link>
            <Link to="/signup" className="px-8 py-4 rounded-full bg-white text-primary border border-primary/20 font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A Better Way to Learn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Expert Instructors", desc: "Learn from industry professionals who are passionate about teaching.", icon: "👨‍🏫" },
              { title: "Self-Paced Learning", desc: "Watch high-quality videos anytime, anywhere, on any device.", icon: "⏱️" },
              { title: "Interactive Community", desc: "Join a community of learners to share knowledge and grow together.", icon: "🤝" }
            ].map((feature, idx) => (
              <div key={idx} className="glass p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary/50">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to start your journey?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">Join thousands of students and start learning today.</p>
          <Link to="/signup" className="inline-block px-10 py-4 bg-white text-primary font-bold rounded-full shadow-xl hover:bg-gray-50 transition-colors">
            Join Now
          </Link>
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
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/create-course" element={<CreateCourse />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
