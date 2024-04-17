import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { BASE_URL } from "../utils/contants";
import axios from "axios";
import { Modal } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [isNewUser, setIsNewUser] = useState(false);

  const [feedbackModal, setFeedbackModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [feedbackModalStage, setFeedbackModalStage] = useState(0);
  const handleCloseFeedbackModal = () => {
    setFeedbackModal(false);
    setFeedbackModalStage(0);
    setSelectedCompany("");
  };
  const handleOpenFeedbackModal = () => setFeedbackModal(true);

  const [companies, setCompanies] = useState<any>([]);

  const handleLogin = async (event: any) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email) && isNewUser) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6 && isNewUser) {
      setError("Password should be atleast 6 characters long");
      return;
    }
    const config: any = {
      url: `${BASE_URL}/${isNewUser ? "signup" : "login"}`,
      data: {
        email,
        password,
      },
      method: "POST",
    };

    try {
      const response = await axios.request(config);
      if (isNewUser) {
        setIsNewUser(false);
        sessionStorage.setItem("email", email);
        setEmail("");
        setPassword("");
        setError("");
        alert("User created successfully");
        return;
      }
      console.log(response.data);
      sessionStorage.setItem("isLogged", "true");
      sessionStorage.setItem("email", email);
      navigate("/layout");
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

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
      setFeedbackModalStage(1);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearchFeedbacks();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-[400px] mx-auto my-20">
      <Modal
        onCancel={handleCloseFeedbackModal}
        onOk={handleCloseFeedbackModal}
        open={feedbackModal}
        footer={null}
        title={null}
      >
        <div className="pt-5">
          {feedbackModalStage == 0 ? (
            <div className="pt-5">
              <h4 className="pb-3">Select Company to view Feedbacks</h4>
              <div className="grid grid-cols-2 gap-4 ">
                {companies.map((company: any, index: number) => (
                  <div
                    onClick={() => {
                      setSelectedCompany(company);
                      setFeedbackModalStage(1);
                    }}
                    className="shadow p-2 rounded-lg border cursor-pointer"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          ) : feedbackModalStage == 1 ? (
            <div className="pt-5">
              <h4 className="pb-5">Feedbacks of Company: {selectedCompany}</h4>
              {feedbacks?.length > 0 && (
                <p className="pb-2 text-base">
                  How was your experience with {selectedCompany}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 ">
                {feedbacks?.filter((s: any) => s?.company == selectedCompany)
                  ?.length > 0 ? (
                  feedbacks
                    ?.filter((s: any) => s?.company == selectedCompany)
                    ?.map((feedback: any, index: number) => (
                      <div
                        className="shadow p-2 rounded-lg cursor-pointer flex flex-col gap-1 border"
                        key={index}
                      >
                        <div>
                          <b>{feedback.username}</b> - {feedback.answer}
                        </div>
                        <div></div>
                      </div>
                    ))
                ) : (
                  <p className="font-bold">No feedbacks found</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
      <div className="flex flex-col justify-center items-center p-4 lg:p-12 md:border border-gray-500/40 rounded-lg">
        <div className="flex flex-col justify-center text-center gap-y-6 items-center mb-12">
          <img
            src="/sidganga.png"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
            alt="logo"
          />
          <h1 className="text-xl font-semibold">
            Siddaganga Institute Of Technology Chatbot
          </h1>
        </div>
        <h1 className="text-2xl font-bold mb-7">
          {isNewUser ? "Sign up" : "Login"}
        </h1>
        <div className="flex flex-col items-center gap-5 justify-center w-full">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border rounded-md border-black/20 w-full py-3 px-3"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border w-full rounded-md border-black/20 py-3 px-3"
            />
            <button
              className="absolute right-4 top-1/2 transform opacity-50 -translate-y-1/2 focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <IoEyeOffOutline size={20} />
              ) : (
                <IoEyeOutline size={20} />
              )}
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="bg-gray-500 hover:bg-gray-500/50 py-3 rounded-md text-white font-semibold px-3 w-[200px]"
          >
            {isNewUser ? "Sign up" : "Login"}
          </button>
          <button
            onClick={() => {
              navigate("/layout", { state: { isGuest: true } });
            }}
            className="bg-gray-500 hover:bg-gray-500/50 py-3 rounded-md text-white font-semibold px-3 w-[200px]"
          >
            Login as Guest
          </button>
          <p
            onClick={() => {
              setIsNewUser(!isNewUser);
              setEmail("");
              setPassword("");
              setError("");
            }}
            className="text-sm cursor-pointer"
          >
            {isNewUser ? "Already have an account?" : "Don't have an account?"}
          </p>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
      <button
        // onClick={handleOpenFeedbackModal}
        onClick={() => {
          navigate("/company");
        }}
        className="mt-3 w-full bg-blue-800 text-white p-2 px-3 rounded-md"
      >
        See Students Feedbacks
      </button>
    </div>
  );
};

export default Login;
