import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import { BubbleBackground } from "../../components";

const LanguageDescription = () => {
  const [description, setDescription] = useState<string>("");
  const { id } = useParams();
  const pathname = useLocation();
  const pageRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDescriprion();
    if (pageRef.current) {
      pageRef.current.scrollTo(0, 0);
    }
  }, [pathname, pageRef.current]);

  const getDescriprion = () => {
    axios
      .post("http://localhost:8081/get-description", { id })
      .then((res) =>
        res.data ? setDescription(res.data) : console.log("non trovato")
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="language-description">
      <BubbleBackground />
      <div className="page" ref={pageRef}>
        <h1>{id}</h1>
        <div className="description">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
        <div className="button-wrapper">
          <button
            className="view-stats"
            onClick={() => {
              navigate("/statistics/" + encodeURIComponent(id));
            }}
          >
            view statistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageDescription;
