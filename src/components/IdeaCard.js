import Axios from "axios";
import React, { useState } from "react";

function IdeaCard(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [file, setFile] = useState();
  const [drafttime, setDraftTime] = useState("");

  async function submitHandler(e) {
    e.preventDefault();
    setIsEditing(false);
    props.setIdeas((prev) =>
      prev.map(function (idea) {
        if (idea._id == props.id) {
          return { ...idea, name: draftName, time: ideaTime };
        }
        return idea;
      })
    );
    const data = new FormData();
    if (file) {
      data.append("photo", file);
    }
    data.append("_id", props.id);
    data.append("name", draftName);
    data.append("time", draftTime);
    const newPhoto = await Axios.post("/update-idea", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (newPhoto.data) {
      props.setIdeas((prev) => {
        return prev.map(function (idea) {
          if (idea._id == props.id) {
            return { ...idea, photo: newPhoto.data };
          }
          return idea;
        });
      });
    }
  }

  return (
    <div className="card">
      <div className="our-card-top">
        {isEditing && (
          <div className="our-custom-input">
            <div className="our-custom-input-interior">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                className="form-control form-control-sm"
                type="file"
              />
            </div>
          </div>
        )}
        <img
          src={
            props.photo ? `/uploaded-photos/${props.photo}` : "/fallback.png"
          }
          className="card-img-top"
          alt={`${props.species} named ${props.name}`}
        />
      </div>
      <div className="card-body">
        {!isEditing && (
          <>
            <h4>{props.name}</h4>
            <p className="text-muted small">{props.time}</p>
            {!props.readOnly && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setDraftName(props.name);
                    setDraftTime(props.time);
                    setFile("");
                  }}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>{" "}
                <button
                  onClick={async () => {
                    const test = Axios.delete(`/idea/${props.id}`);
                    props.setIdeas((prev) => {
                      return prev.filter((idea) => {
                        return idea._id != props.id;
                      });
                    });
                  }}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
        {isEditing && (
          <form onSubmit={submitHandler}>
            <div className="mb-1">
              <input
                autoFocus
                onChange={(e) => setDraftName(e.target.value)}
                type="text"
                className="form-control form-control-sm"
                value={draftName}
              />
            </div>
            <div className="mb-2">
              <input
                onChange={(e) => setDraftTime(e.target.value)}
                type="text"
                className="form-control form-control-sm"
                value={draftTime}
              />
            </div>
            <button className="btn btn-sm btn-success">Save</button>{" "}
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-sm btn-outline-secondary"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default IdeaCard;
