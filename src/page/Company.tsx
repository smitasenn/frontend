import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/contants";

type Props = {};

const Company = (props: Props) => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any>([]);

  const [feedbacks, setFeedbacks] = useState([]);

  const handleSearchFeedbacks = async () => {
    const config: any = {
      url: `${BASE_URL}/get_feedback`,
      method: "GET",
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      setFeedbacks(response.data);
      const companySet = new Set();
      response.data.forEach((feedback: any) => {
        companySet.add(feedback.company);
      });
      setCompanies(Array.from(companySet));
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearchFeedbacks();
  }, []);
  return (
    <div className="px-5 py-5">
      <div>Select Company</div>
      <div className="grid grid-cols-4 gap-4 mt-3">
        {companies?.length > 0 ? (
          companies.map((company: any, index: number) => (
            <div
              onClick={() => {
                navigate("/feedback", {
                  state: {
                    feedbacks: feedbacks.filter(
                      (feedback: any) => feedback.company === company
                    ),
                    selectedCompany: company,
                  },
                });
              }}
              className="p-2 px-3 rounded-md shadow bg-white cursor-pointer"
            >
              {company}
            </div>
          ))
        ) : (
          <div className="col-span-1">No companies found</div>
        )}
      </div>
    </div>
  );
};

export default Company;
