import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { BubbleBackground } from "../../components";
import ReactMarkdown from "react-markdown";
import { RelatedUsagePageInterface } from "./RelatedUsagePage.types";

const RelatedUsagePage = () => {
  const { id } = useParams();
  const pathname = useLocation();
  const [relatedLanguages, setRelatedLanguages] = useState<
    Array<RelatedUsagePageInterface>
  >([]);
  const [usageDescription, setUsageDescription] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    getRelatedLanguages();
  }, [pathname]);

  const getRelatedLanguages = () => {
    axios
      .post("http://localhost:8081/get-related-languages", { id })
      .then((res) => {
        setRelatedLanguages(res.data[0]);
        setUsageDescription(res.data[1]);
        console.log(relatedLanguages);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="related-page">
      <BubbleBackground />
      <div className="page">
        <h1>{id}</h1>
        <div className="description">
          <ReactMarkdown>{usageDescription}</ReactMarkdown>
          <p className="introduction-to-languages">Main languages</p>
        </div>
        <div className="related-languages">
          {relatedLanguages
            ? relatedLanguages.map((elem, i) => {
                return (
                  <div
                    className="single-related-language-wrapper"
                    onClick={() => {
                      navigate(
                        "/programming-languages/" +
                          encodeURIComponent(elem.languageName)
                      );
                    }}
                  >
                    {" "}
                    <i className={elem.icon}></i>
                    <p>{elem.languageName}</p>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default RelatedUsagePage;
