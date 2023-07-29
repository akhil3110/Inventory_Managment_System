import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row justify-between">
        <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0 cursor-default">
          <svg
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
          >
            <rect width="100%" height="100%" fill="#2D70FF" />
            <rect x="30" y="30" width="40" height="40" fill="#FFFFFF" />
            <rect x="35" y="45" width="10" height="15" fill="#2D70FF" />
            <rect x="55" y="40" width="10" height="25" fill="#2D70FF" />
            <rect x="70" y="50" width="10" height="15" fill="#2D70FF" />
            <text
              x="50%"
              y="70%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="14"
              fontFamily="Arial"
            >
              Inventory Pro
            </text>
          </svg>
          <span className="ml-3 text-xl">Inventory Managment System</span>
        </a>
        <button
          onClick={handleLogout}
          className="inline-flex items-center bg-gray-400 text-white border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
        >
          Log Out
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
