import { createChatBotMessage } from "react-chatbot-kit";
import GotIt from "./widgets/options/GotIt";
import AgeDropdown from "./widgets/options/AgeDropdown";
import IWidget from "react-chatbot-kit/build/src/interfaces/IWidget";
import IConfig from "react-chatbot-kit/build/src/interfaces/IConfig";
import chatGPT from "/sidganga.png";

const config: IConfig = {
  botName: "Student Info System Bot",
  initialMessages: [
    createChatBotMessage(`Hello, You are talking with Siddaganga chatbot!`, {
      widget: "gotIt",
    }),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#E5E5E5",
    },
    chatButton: {
      backgroundColor: "#376B7E",
    },
  },
  customComponents: {
    botAvatar: (props: any) => <img src={chatGPT} alt="bot" style={
      {
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        objectFit: "cover"
      }
    
    } {...props} />,
  },
  widgets: [
    {
      widgetName: "gotIt",
      widgetFunc: (props: any) => <GotIt {...props} />,
    },
    {
      widgetName: "ageDropdown",
      widgetFunc: (props: any) => <AgeDropdown {...props} />,
    },
  ] as IWidget[],
};

export default config;
