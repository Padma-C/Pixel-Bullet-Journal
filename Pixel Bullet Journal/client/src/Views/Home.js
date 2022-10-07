import React from 'react';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../UserContext';
import logo from '../Images/logo.png';
import axios from 'axios';
import './Home.css';
import Moment from 'react-moment';
import HeatMap from '@uiw/react-heat-map';
import Tooltip from '@uiw/react-tooltip';
import Login from './Login';

import Footer from './Footer';

function Home() {
  const userData = useContext(UserContext);
  const [inputVal, setInputVal] = useState('');
  const [moodVal, setMoodVal] = useState(5);

  const [records, setRecords] = useState([]);
  const [sortType, setSortType] = useState([]);

  var minDate = new Date();
  minDate.setMonth(minDate.getMonth() - 7 + 1);

  console.log('home.js records is', records);

  let sortedArray;
  const sortArray = (type) => {
    const types = {
      records: 'records',
      mood: 'mood',
      date: 'entryDate',
    };
    const sortProperty = types[type];
    const sorted = [...records].sort(
      (a, b) => b[sortProperty] - a[sortProperty]
    );
    sortedArray = sorted.reverse();
  };

  sortArray(sortType);

  useEffect(() => {
    if (!userData) return;
    axios
      .get('http://localhost:4000/records', { withCredentials: true })
      .then((response) => {
        setRecords(response.data);
      });
    // eslint-disable-next-line
  }, []);

  if (!userData.email)
    return (
      <>
        <div className="background-container">
          <div className="logo-container">
            <div className="logo-wrapper">
              <img className="logo" src={logo} alt={'logo'} />
              <p className="logo-text">TimeLapse</p>
            </div>
            <h1>Your online journaling app.</h1>
          </div>
          <Login />
        </div>

        <Footer />
      </>
    );

  function addRecord(e) {
    e.preventDefault();
    axios
      .put(
        'http://localhost:4000/records',
        { text: inputVal, mood: moodVal },
        { withCredentials: true }
      )
      .then((response) => {
        console.log('suspect #2');

        setRecords([...records, response.data]);
        setInputVal('');
        setMoodVal('');
      });
  }

  function updateRecord(record) {
    const data = { id: record._id, del: !record.del };
    axios
      .post('http://localhost:4000/records', data, {
        withCredentials: true,
      })
      .then(() => {
        const newRecords = records.map((t) => {
          if (t._id === record._id) {
            t.del = !t.del;
          }
          return t;
        });
        console.log('suspect #3');

        setRecords([...newRecords]);
      });
  }

  return (
    <div className="home-container">
      <form className="dashboard" onSubmit={(e) => addRecord(e)}>
        <div id="record-form" className="record-form">
          <input
            className="form-textarea"
            placeholder={'Summarize your day...'}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
        </div>
        <div className="range-slider">
          <label>
            How are you feeling today?
            <div className="slidecontainer">
              <div>
                <div className="sad">Bad</div>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={moodVal}
                onChange={(e) => setMoodVal(e.target.value)}
                className={`slider ${
                  moodVal < 1
                    ? 'slider-1'
                    : moodVal < 2
                    ? 'slider-2'
                    : moodVal < 3
                    ? 'slider-3'
                    : moodVal < 4
                    ? 'slider-4'
                    : moodVal < 5
                    ? 'slider-5'
                    : 'slider-6'
                }`}
              />
              <div>
                <div className="happy">Good</div>{' '}
              </div>
            </div>
            <span>{moodVal}</span>
          </label>
        </div>
      </form>
      {
        <div className="heatmap-container">
          <HeatMap
            startDate={new Date(minDate)}
            legendCellSize={0}
            value={sortedArray.map((record, index) => {
              return {
                date: record.entryDate,
                count: record.mood,
                content: record.text,
              };
            })}
            width={700}
            panelColors={{
              1: '#eee',
              2: '#EBEFD9',
              3: '#C5D4E8',
              4: '#B8C549',
              5: '#6491BB',
              6: '#435F7A',
            }}
            rectRender={(props, data) => {
              return (
                <Tooltip
                  key={props.key}
                  placement="top"
                  content={`count: ${data.count || 0}`}
                >
                  <rect {...props} />
                </Tooltip>
              );
            }}
          />
        </div>
      }

      <div className="grid-container">
        <div>
          <img
            className="trash-icon"
            src={require('../Images/trash-icon.svg').default}
            alt={'delete'}
          />
        </div>
        <div>Notes</div>

        <div>Date</div>
        <select onChange={(e) => setSortType(e.target.value)}>
          <option value="records">Records</option>
          <option value="mood">Mood</option>
        </select>
      </div>
      <div className="grid-box">
        <ul>
          {sortedArray.map((record, index) => {
            return (
              <div className="grid-container-data" key={index}>
                <div>
                  <input
                    type={'checkbox'}
                    checked={record.del}
                    onChange={(e) => updateRecord(record)}
                  />
                </div>
                <div>
                  {record.del ? window.location.reload(true) : record.text}
                </div>
                <div>
                  <Moment
                    format="D MMM YYYY"
                    withTitle
                    date={record.entryDate}
                  />
                </div>
                <div className="mood-container">
                  {record.mood}
                  <div
                    className={`colorkey ${
                      record.mood < 1
                        ? 'color-1'
                        : record.mood < 2
                        ? 'color-2'
                        : record.mood < 3
                        ? 'color-3'
                        : record.mood < 4
                        ? 'color-4'
                        : record.mood < 5
                        ? 'color-5'
                        : 'color-6'
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
