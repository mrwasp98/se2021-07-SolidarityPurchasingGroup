import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyNav from "./Components/MyNav";
import { BrowserRouter as Router, Route, } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Route path="/" render={() => <> <MyNav  IsLogin={false} /> </>} />
         </Router>
    </>
  );
}

export default App;
