import Structure from "./components/Structure";
import Sidebar from "./components/Sidebar";
import Screen from "./components/Screen";

function App({ sidebarcontent, maincontent }) {
  return (
    <div>
      <Structure sidebarcontent={<Sidebar />} maincontent={<Screen />} />
    </div>
  );
}

export default App;
