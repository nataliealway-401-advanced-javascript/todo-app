import React, { useState, useEffect, useContext } from "react";
import useForm from "../hooks/useForm";
import { When, If, Then, Else } from "../if/if.js";
import Modal from "../modal/modal.js";
import useFetch from "../hooks/useFetch";
import { SettingsContext } from "../../context/settings.js";
import { LoginContext } from "../../auth/login";
import Auth from "../../auth/auth";

import "./todo.scss";

const ToDo = props => {
  const settingsContext = useContext(SettingsContext);

  const [todoList, setTodoList] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState({});
  const [handleSubmit, handleChange, values] = useForm(addItem);
  const [setRequest, response, error, isLoading] = useFetch();

  const url = "https://api-js401.herokuapp.com/api/v1/todo";


  /**
   * set todo list from results data if data exists, else get all
   */
  useEffect(() => {
    if (response.count >= 0) {
      setTodoList(response.results);
    } else {
      getAll();
    }
  }, [response]);


  useEffect(() => {
    let complete = todoList.filter(item => !item.complete).length;
    let incomplete = todoList.filter(item => item.complete).length;

    document.title = `ToDo:${complete} Done:${incomplete}`;

    !settingsContext.displayCompleted
      ? settingsContext.setCurrentDisplayed(todoList.length)
      : settingsContext.setCurrentDisplayed(todoList.length - complete);
  });

  const getAll = () => {
    const request = {
      url: url,
      options: {
        method: "GET"
      }
    };
    setRequest(request);
  };

  /**
   * Get data from API on mount
  */
  useEffect(() => {
    getAll();
  }, []);


  /**
   * Send a request to add an item to the database
   * @param {*} data 
   */
  function addItem(data) {
    const request = {
      url: url,
      options: {
        method: "POST",
        body: JSON.stringify(data)
      }
    };
    setRequest(request);
  }

  /**
   * Send a request to delete an item from the database
   * @param {*} id 
   */
  const deleteItem = id => {
    console.log(id);
    const request = {
      url: `${url}/${id}`,
      options: {
        method: "DELETE"
      }
    };
    setRequest(request);
  };

  const saveItem = updatedItem => {
    const request = {
      url: `${url}/${updatedItem._id}`,
      options: {
        method: "PUT",
        body: JSON.stringify(updatedItem)
      }
    };
    setRequest(request);
  };


  /**
   * Toggles a todo item complete or incomplete.
   * @param {*} id 
   */
  const toggleComplete = id => {
    let item = todoList.filter(i => i._id === id)[0] || {};
    if (item._id) {
      item.complete = !item.complete;
      saveItem(item);
    }
  };


  /**
   * Toggles the details of a specific todo item
   * @param {*} id 
   */
  const toggleDetails = id => {
    let showDetailsState = !showDetails;
    let itemDetails = todoList.filter(item => item._id === id)[0] || {};

    setDetails(itemDetails);
    setShowDetails(showDetailsState);
  };

  
  /**
   * Toggles the the pages of items 
   */
  const togglePageNumber = e => {
    if (e.target.name === "nextButton") {
      settingsContext.setPageNumber(settingsContext.pageNumber + 1);
    }
    if (e.target.name === "prevButton") {
      settingsContext.setPageNumber(settingsContext.pageNumber - 1);
    }
  };

  const toggleHideComplete = e => {
    if (e.target.name === "hideCompleteButton") {
      settingsContext.setDisplayCompleted(!settingsContext.displayCompleted);
    }
  };

  return (
    <>
      <Auth capbility="read">
        <header id="todoHeader">
          <h2>
            There are {todoList.filter(item => !item.complete).length} Items To
            Complete
          </h2>
        </header>
      </Auth>

      <section className="todo">
        <div id="addItem">
          <Auth capability="create">
            <div>
              <h3>Add Item</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  <span>To Do Item</span>
                  <input
                    name="text"
                    placeholder="Add To Do List Item"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Difficulty Rating</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    name="difficulty"
                    defaultValue="3"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Assigned To</span>
                  <input
                    type="text"
                    name="assignee"
                    placeholder="Assigned To"
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <span>Due</span>
                  <input type="date" name="due" onChange={handleChange} />
                </label>
                <button>Add Item</button>
              </form>
            </div>
          </Auth>
        </div>
        <Auth capbilith="read">
          <div>
            <button
              className="smButtons"
              name="hideCompleteButton"
              onClick={toggleHideComplete}
            >
              Display Completed
            </button>
            <ul>
              <If condition={settingsContext.displayCompleted === true}>
                <Then>
                  {todoList
                    .filter(item => item.complete === false)
                    .slice(
                      settingsContext.pageNumber *
                        settingsContext.itemsDisplayed,
                      settingsContext.pageNumber *
                        settingsContext.itemsDisplayed +
                        settingsContext.itemsDisplayed
                    )
                    .map(item => (
                      <li
                        className={`complete-${item.complete.toString()}`}
                        key={item._id}
                      >
                        <span onClick={() => toggleComplete(item._id)}>
                          {item.text}
                        </span>
                        <Auth capability="update">
                          <button onClick={() => toggleDetails(item._id)}>
                            Details
                          </button>
                        </Auth>
                        <Auth capability="delete">
                          <button onClick={() => deleteItem(item._id)}>
                            Delete
                          </button>
                        </Auth>
                      </li>
                    ))}
                </Then>
                <Else>
                  {todoList
                    .slice(
                      settingsContext.pageNumber *
                        settingsContext.itemsDisplayed,
                      settingsContext.pageNumber *
                        settingsContext.itemsDisplayed +
                        settingsContext.itemsDisplayed
                    )
                    .map(item => (
                      <li
                        className={`complete-${item.complete.toString()}`}
                        key={item._id}
                      >
                        <span onClick={() => toggleComplete(item._id)}>
                          {item.text}
                        </span>
                        <Auth capability="update">
                          <button onClick={() => toggleDetails(item._id)}>
                            Details
                          </button>
                        </Auth>
                        <Auth capability="delete">
                          <button onClick={() => deleteItem(item._id)}>
                            Delete
                          </button>
                        </Auth>
                      </li>
                    ))}
                </Else>
              </If>
              <If condition={settingsContext.pageNumber >= 1}>
                <Then>
                  <button
                    className="smButtons"
                    name="prevButton"
                    onClick={togglePageNumber}
                  >
                    Previous
                  </button>
                </Then>
              </If>
              <If
                condition={
                  settingsContext.currentDisplayed > 5 &&
                  settingsContext.currentDisplayed /
                    (settingsContext.pageNumber + 1) >
                    settingsContext.itemsDisplayed
                }
              >
                <Then>
                  <button
                    className="smButtons"
                    name="nextButton"
                    onClick={togglePageNumber}
                  >
                    Next
                  </button>
                </Then>
              </If>
            </ul>
          </div>
        </Auth>
      </section>

      <When condition={showDetails}>
        <Modal title="To Do Item" close={toggleDetails}>
          <div className="todo-details">
            <header>
              <span>
                <h4>Assigned To:</h4> {details.assignee}{" "}
              </span>
              <span>
                <h4>Difficulty:</h4> {details.difficulty} out of 5{" "}
              </span>
              <span>
                <h4>Due: </h4>
                {details.due}{" "}
              </span>
            </header>
            <h4>Details:</h4>
            <div className="item">{details.text}</div>
          </div>
        </Modal>
      </When>
    </>
  );
};

export default ToDo;
