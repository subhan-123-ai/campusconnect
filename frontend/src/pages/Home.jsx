import { Link } from 'react-router-dom';

export default function Home() {
  const universities = [
    { id: 1, name: 'ITU', shortName: 'ITU', city: 'Lahore' },
    { id: 2, name: 'FAST', shortName: 'FAST', city: 'Lahore' },
    { id: 3, name: 'COMSATS', shortName: 'COMSATS', city: 'Islamabad' },
    { id: 4, name: 'UET', shortName: 'UET', city: 'Lahore' },
    { id: 5, name: 'PU', shortName: 'PU', city: 'Lahore' },
    { id: 6, name: 'NUST', shortName: 'NUST', city: 'Islamabad' },
  ];

  const features = [
    { icon: '📚', title: 'Share Resources', description: 'Upload and access study notes, past papers, and materials' },
    { icon: '👥', title: 'Find Study Partners', description: 'Connect with students studying the same subjects' },
    { icon: '📅', title: 'Campus Events', description: 'Discover and join workshops, seminars, and activities' },
    { icon: '💬', title: 'Report Issues', description: 'Submit complaints anonymously or track their status' },
  ];

  return (
    <>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary py-12 text-white sm:py-16 lg:py-20">
          <div className="container-main text-center">
            <h1 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl lg:text-5xl">Welcome to CampusConnect</h1>
            <p className="mx-auto mb-8 max-w-2xl text-base text-gray-100 sm:text-lg lg:text-xl">
              Your centralized platform for academic collaboration and campus engagement
            </p>
            <div className="flex flex-col justify-center gap-3 px-4 sm:flex-row sm:gap-4 sm:px-0">
              <Link to="/register" className="rounded-lg bg-white px-8 py-3 font-bold text-primary transition hover:bg-gray-100">
                Get Started
              </Link>
              <Link to="/login" className="rounded-lg border-2 border-white px-8 py-3 font-bold transition hover:bg-white hover:text-primary">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-12 sm:py-16">
          <div className="container-main">
            <h2 className="mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-3xl lg:text-4xl">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="card text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Universities Section */}
        <section className="bg-gray-50 py-12 sm:py-16">
          <div className="container-main">
            <h2 className="mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-3xl lg:text-4xl">Supported Universities</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
              {universities.map((uni) => (
                <div key={uni.id} className="card text-center hover:shadow-lg">
                  <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="font-bold text-primary text-lg">{uni.shortName}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{uni.name}</h3>
                  <p className="text-sm text-gray-600">{uni.city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-12 text-white sm:py-16">
          <div className="container-main text-center">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Ready to connect?</h2>
            <p className="mb-8 text-base text-blue-100 sm:text-lg">Join thousands of students already using CampusConnect</p>
            <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block">
              Create Account Now
            </Link>
          </div>
        </section>
      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container-main">
          <div className="mb-8 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-bold mb-4">CampusConnect</h3>
              <p className="text-gray-400">Building a Connected Campus Community</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Resources</a></li>
                <li><a href="#" className="hover:text-white">Study Partners</a></li>
                <li><a href="#" className="hover:text-white">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CampusConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}