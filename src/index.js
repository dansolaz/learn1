import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import CreateNewForm from "./components/CreateNewForm";
import IdeaCard from "./components/IdeaCard";

function App() {
  const [ideas, setIdeas] = useState([]);
  useEffect(() => {
    async function go() {
      const response = await axios.get("/myideas/shitty");
      setIdeas(response.data);
    }
    go();
  }, []);
  return (
    <div className="container">
      <p>
        <a href="a">&laquo; Back Home</a>
      </p>
      <CreateNewForm setIdeas={setIdeas} />
      <h1>MAINTAINCE IDEAS</h1>
      <p>"nevermind ofer said all ideas are shit go fetch"</p>
      <div className="ideas-grid">
        {ideas.map(function (idea) {
          return (
            <IdeaCard
              key={idea._id}
              name={idea.name}
              time={idea.time}
              photo={idea.photo}
              id={idea._id}
              setIdeas={setIdeas}
            ></IdeaCard>
          );
        })}
      </div>
    </div>
  );
}

const root = createRoot(document.querySelector("#app"));
root.render(<App />);
