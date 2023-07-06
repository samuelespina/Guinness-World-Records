import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import ReactMarkdown from "react-markdown";

const LanguageDescription = () => {
  const [description, setDescription] = useState<string>("");
  const { id } = useParams();
  const pathname = useLocation();

  useEffect(() => {
    getDescriprion();
  }, [pathname]);

  const getDescriprion = () => {
    axios
      .post("http://localhost:8081/get-description", { id })
      .then((res) =>
        res.data ? setDescription(res.data) : console.log("non trovato")
      )
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  );
};

export default LanguageDescription;
