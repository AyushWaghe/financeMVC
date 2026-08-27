import React, { useEffect, useRef, useState } from "react";

import { financeAIapi, api } from "../../api/AxiosConfig.js";
import { useDispatch, useSelector } from 'react-redux';

import "./FinanceAIPage.css";

import SideNavBar from "../SideNavBar/SideNavBar.js";

const FinanceAIPage = () => {

  const user = useSelector((state) => state.user);
  const userId = user.user.userId;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [navBarisToggle, setNavBarisToggle] = useState(false);

  // Think & Answer
  const [reasoningEnabled, setReasoningEnabled] = useState(false);
  const [reasoningCredits, setReasoningCredits] = useState(0);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    fetchReasoningCredits();
  }, []);

  const setNavBarTogggle = () => {
    setNavBarisToggle(!navBarisToggle);
  };



  const fetchMessages = async () => {
    try {
      const response = await api.get(`/financeAIChat/getMessages`);
      console.log("Messages response:", response);
console.log("Messages data:", response.data);
console.log("Is array:", Array.isArray(response.data));
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to get messages:", error);
    }
  };

  const fetchReasoningCredits = async () => {
    try {
      const response = await api.get(`/user-profile/getCredits`,{
        params:{
          userId:userId
        }
      });

      setReasoningCredits(response.data.data);
    } catch (error) {
      console.error("Failed to get reasoning credits:", error);
    }
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    // Prevent reasoning request when no credits remain
    if (reasoningEnabled && reasoningCredits <= 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.get(`/financeAIChat`, {
        params: {
          query: trimmedMessage,
          thinkAndAnswer: reasoningEnabled
        }
      });

      setMessages(response.data);
      setMessage("");

      // Refresh credits 
      if (reasoningEnabled) {
        const response = await api.get(`/user-profile/decrementCredit`,{
          params:{
            userId:userId
          }
        });
        setReasoningCredits(response.data.data);
      }

    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const deleteConversation = async () => {
    try {
      await api.delete("/financeAIChat");
      setMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const handleReasoningToggle = () => {
    if (reasoningCredits <= 0) {
      return;
    }

    setReasoningEnabled((previous) => !previous);
  };

  useEffect(() => {
    if (reasoningCredits <= 0) {
      setReasoningEnabled(false);
    }
  }, [reasoningCredits]);

  return (
    <div className="FinanceAIPageContainer">

      <div className="navBar">
        <SideNavBar
          isToggle={setNavBarTogggle}
        />
      </div>

      <div className="FinanceAIMasterContainer">

        <div className="FinanceAIHeader">
          <div>
            <h1>Finance AI</h1>
            <p>
              Ask questions about your transactions, bills and spending.
            </p>
          </div>
        </div>

        <div className="FinanceAIChatCard">

          <div className="FinanceAIMessageContainer">

            {messages.length === 0 && (
              <div className="FinanceAIEmptyState">

                <div className="FinanceAIEmptyIcon">
                  AI
                </div>

                <h2>How can I help?</h2>

                <p>
                  Ask me about your spending, transactions, bills,
                  budgets or financial trends.
                </p>

                <div className="FinanceAISuggestions">

                  <button
                    onClick={() =>
                      setMessage("How much did I spend this month?")
                    }
                  >
                    How much did I spend this month?
                  </button>

                  <button
                    onClick={() =>
                      setMessage("Show me my pending bills")
                    }
                  >
                    Show me my pending bills
                  </button>

                  <button
                    onClick={() =>
                      setMessage("Where am I spending the most?")
                    }
                  >
                    Where am I spending the most?
                  </button>

                </div>

              </div>
            )}

            {messages.map((chat) => {

              const isUser = chat.role === "USER";

              return (
                <div
                  key={chat.messageId}
                  className={`FinanceAIMessageRow ${isUser
                    ? "FinanceAIUserRow"
                    : "FinanceAIAssistantRow"
                    }`}
                >

                  <div
                    className={`FinanceAIMessage ${isUser
                      ? "FinanceAIUserMessage"
                      : "FinanceAIAssistantMessage"
                      }`}
                  >

                    {!isUser && (
                      <div className="FinanceAIAvatar">
                        AI
                      </div>
                    )}

                    <div className="FinanceAIMessageContent">
                      {chat.message}
                    </div>

                  </div>

                </div>
              );
            })}

            {loading && (
              <div className="FinanceAIMessageRow FinanceAIAssistantRow">

                <div className="FinanceAIMessage FinanceAIAssistantMessage">

                  <div className="FinanceAIAvatar">
                    AI
                  </div>

                  <div className="FinanceAITyping">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>

              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          <div className="FinanceAIInputContainer">

            {/* Think & Answer option */}
            <div className="FinanceAIReasoningOption">

  <label className="FinanceAIReasoningToggle">

    <input
      type="checkbox"
      checked={reasoningEnabled}
      onChange={handleReasoningToggle}
      disabled={reasoningCredits <= 0 || loading}
    />

    <span className="FinanceAIReasoningSlider"></span>

    <span className="FinanceAIReasoningLabel">
      🧠 Think & Answer
    </span>

    <span className="FinanceAIReasoningInfo">
      i

      <span className="FinanceAIReasoningTooltip">
        <strong>Think & Answer</strong>
        <br />
        Uses deeper reasoning for complex questions.Take more time.
        <br />
        <span>20 Credits refresh every 24 hours.</span>
      </span>
    </span>

  </label>

  <span
    className={`FinanceAIReasoningCredits ${
      reasoningCredits === 0
        ? "FinanceAIReasoningCreditsEmpty"
        : ""
    }`}
  >
    {reasoningCredits} credits left
  </span>

</div>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Finance AI something..."
              rows={1}
              disabled={loading}
            />

            <button
              className="FinanceAISendButton"
              onClick={sendMessage}
              disabled={!message.trim() || loading}
            >
              {loading ? "..." : "Send"}
            </button>

            <button
              className="FinanceAIDeleteButton"
              onClick={deleteConversation}
              disabled={loading || messages.length === 0}
            >
              Delete conversation
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FinanceAIPage;