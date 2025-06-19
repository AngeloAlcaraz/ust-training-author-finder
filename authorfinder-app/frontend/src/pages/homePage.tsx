import { Link } from "react-router";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to AuthorFinder</h1>
      <p className="text-lg mb-8">Find your favorite authors and their works.</p>
      <Link to="/authors" className="btn btn-primary">
        Explore Authors
      </Link>

    </div>
  );
}

export default HomePage;