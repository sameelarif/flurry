import "./App.css";
import SideNav from "./Components/SideNav";
import Dash from "./Pages/Dash";
import Task from "./Pages/Task";
import Settings from "./Pages/Settings";
import Email from "./Pages/Email";
import Sites from "./Pages/Sites";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
function App() {
  const location = useLocation();
  return (
    <div
      className="App"
      style={{
        backgroundColor: "transparent",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div className="container dash">
        <div className="abs" style={{ position: "absolute" }}>
          <ToastContainer />
        </div>
        <SideNav />
        <AnimatePresence exitBeforeEnter>
          <Switch location={location} key={location.pathname}>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/tasks">
              <Task />
            </Route>
            <Route path="/email">
              <Email />
            </Route>
            <Route path="/account">
              <Sites />
            </Route>
            <Route exact path="/">
              <Dash />
            </Route>
          </Switch>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
