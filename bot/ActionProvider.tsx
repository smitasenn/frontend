import React from "react";
import { IMessageOptions } from "react-chatbot-kit/build/src/interfaces/IMessages";

const ActionProvider = ({
  createChatBotMessage,
  setState,
  children,
}: {
  createChatBotMessage: (
    message: string,
    options: IMessageOptions
  ) => {
    loading: boolean;
    widget?: string;
    delay?: number;
    payload?: any;
    message: string;
    type: string;
    id: number;
  };
  setState: any;
  children: any;
}) => {
  const handleGotIt = () => {
    const botMessage = createChatBotMessage("Enter your Name", {});

    setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  const handleUserInput = async (message?: string) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: message }),
    };

    //Start loader and wait for response

    let messages: any = [];
    setState(
      (prev: {
        messages: {
          message: string;
          type: string;
          id: number;
          loading?: boolean;
          widget?: string | undefined;
          delay?: number | undefined;
          payload?: any;
        }[];
      }) => {
        let botMessage: any;
        botMessage = createChatBotMessage("Typing ...", { loading: true });
        messages = [...prev.messages];
        return {
          ...prev,
          messages: [...prev.messages, botMessage],
        };
      }
    );

    await fetch(
      "http://127.0.0.1:8000/get_answer",
      requestOptions
    ).then(async (response: any) => {
      const data = await response.json();
      console.log(data);
      setState(
        (prev: {
          messages: {
            message: string;
            type: string;
            id: number;
            loading?: boolean;
            widget?: string | undefined;
            delay?: number | undefined;
            payload?: any;
          }[];
        }) => {
          // if (
          //   prev.messages[prev.messages.length - 2].message === "Enter your Name"
          // ) {
          //   dispatch(addName(prev.messages[prev.messages.length - 1].message));
          //   botMessage = createChatBotMessage("Enter your Age", {
          //     widget: "ageDropdown",
          //   });
          //   return {
          //     ...prev,
          //     messages: [...prev.messages, botMessage],
          //   };
          // } else if (age) {
          //   dispatch(addAge(age.toString()));
          //   botMessage = createChatBotMessage(
          //     "Thank you. In 5 seconds, bot will exit.",
          //     {}
          //   );
          //   return {
          //     ...prev,
          //     messages: [...prev.messages, botMessage],
          //   };
          // } else {
          //   return prev;
          // }
          let botMessage: any;
          botMessage = createChatBotMessage(data.answer, { loading: false });
          return {
            ...prev,
            messages: [...messages, botMessage],
          };
        }
      );
    });
  };
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleGotIt,
            handleUserInput,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
