import "./App.css";
import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import Block from "./components/Block";
import Select from "react-select";
import { RadioGroup, Radio } from "react-radio-group";
import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
const config = new Configuration({
  apiKey: process.env.REACT_APP_APIKEY,
});

const openai = new OpenAIApi(config);
function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState();
  const [sort, setSort] = useState("desc");
  const [answerLoading, setAnswerLoading] = useState();
  const [data, setData] = useState([
    // {
    //   prompt: "write a poem",
    //   id: 1,
    //   timestamp:
    //     new Date().toLocaleDateString() +
    //     " " +
    //     new Date().toLocaleTimeString("en-US", {
    //       hour: "numeric",
    //       minute: "numeric",
    //     }),
    //   response:
    //     "In the dark of night I hear you calling And I can't resist I have to come and find you I can't resist I have to come and find you I can't resist I have to come and find you",
    // },
  ]);
  const [engines, setEngines] = useState([]);

  useEffect(() => {
    fetchEngines();
    if (localStorage.getItem("responses")) {
      setData(JSON.parse(localStorage.getItem("responses")));
    }
  }, []);

  const fetchEngines = async () => {
    setLoading(true);
    setSelectedEngine(null);
    let res = await openai.listEngines();
    console.log("res.data= ", res.data);
    let temp = [];
    res.data.data.forEach((engine) => {
      if (engine.id === "text-curie-001") {
        console.log("here");
        setSelectedEngine({
          label: engine.id,
          value: engine.id,
        });
      }
      temp.push({
        label: engine.id,
        value: engine.id,
      });
    });

    setEngines(temp);
    setLoading(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    setAnswerLoading(true);
    let prompt = text;
    console.log("selected enginer on submit= ", selectedEngine);
    let res = await openai.createCompletion(selectedEngine.label, {
      prompt: prompt,
      temperature: 0.5,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    console.log("res= ", res);
    if (sort === "asc") {
      setData((prevData) => [
        ...prevData,
        {
          prompt: prompt,
          id: res.data.id,
          response: res.data.choices[0].text,
          timestamp:
            new Date().toLocaleDateString() +
            " " +
            new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            }),
        },
      ]);
    } else {
      setData((prevData) => [
        {
          prompt: prompt,
          id: res.data.id,
          response: res.data.choices[0].text,
          timestamp:
            new Date().toLocaleDateString() +
            " " +
            new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            }),
        },
        ...prevData,
      ]);
    }
    setAnswerLoading(false);
    setText("");
  };

  const handleSelectChange = (obj) => {
    setSelectedEngine(obj);
  };

  const handleRadioChange = (val) => {
    console.log("handleradio called= ", val);
    setSort(val);
    let temp = [...data].reverse();
    setData(temp);
  };

  const handleSave = () => {
    localStorage.setItem("responses", JSON.stringify(data));
  };

  const handleClearResponses = () => {
    setData([]);
    localStorage.removeItem("responses");
  };

  return (
    <div className="App">
      <div className="body">
        <h1>Fun With AI</h1>
        <p style={{ fontWeight: "bold" }}>Enter prompt</p>
        <textarea
          className="textarea"
          value={text}
          placeholder="start typing to enable submit..."
          onChange={handleTextChange}
        />

        <div className="options-container">
          <div style={{ width: "30%" }}>
            <Select
              className="select"
              value={selectedEngine}
              onChange={handleSelectChange}
              isDisabled={loading}
              isLoading={loading}
              placeholder={loading ? "Loading Engines" : "Select Engine"}
              options={engines}
            />
          </div>

          <div
            style={{
              width: "15%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {answerLoading && (
              <div style={{ marginRight: "20px" }}>
                <Spinner color="blue" />
              </div>
            )}
            <button
              type="button"
              className="btn"
              onClick={handleSubmit}
              disabled={loading || answerLoading || text.length < 1}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="middle">
          <h2>Responses</h2>
          <button
            type="button"
            className="delete-btn"
            onClick={handleClearResponses}
            hidden={data && data.length <= 0}
          >
            Clear All Responses
          </button>
          <button
            type="button"
            className="save-btn"
            onClick={handleSave}
            hidden={data && data.length <= 0}
          >
            Save Responses
          </button>
          <div className="radio-group">
            <RadioGroup
              onChange={handleRadioChange}
              selectedValue={sort}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label>
                <Radio value="desc" />
                Sort Descending
              </label>
              <label>
                <Radio value="asc" />
                Sort Ascending
              </label>
            </RadioGroup>
          </div>
        </div>

        {data.length > 0 ? (
          <>
            {data.map((item) => (
              <Block item={item} />
            ))}
          </>
        ) : (
          <p>No prompts submitted yet</p>
        )}
      </div>
    </div>
  );
}

export default App;
